(function () {
  function createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) => {
          const isTextNode =
            typeof child === "string" || typeof child === "number";
          return isTextNode ? createTextNode(child) : child;
        }),
      },
    };
  }

  // 单独处理文本，因为他没有type,props,children
  function createTextNode(nodeValue) {
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue,
        children: [],
      },
    };
  }

  // 全局保存状态，即使工作被中断，状态也会保留
  let nextUnitOfWork = null; // 是下一个需要处理的工作单元（Fiber 节点）。初始化时，它指向 wipRoot，即当前的根节点。
  let wipRoot = null; // 正在处理的fiber的根节点
  let currentRoot = null; // 之前历史的fiber链表的根节点
  let deletions = null; // 要删除的节点

  // 渲染机制
  function render(element, container) {
    wipRoot = {
      dom: container,
      props: {
        children: [element],
      },
      alternate: currentRoot, // 连接到上一次渲染的fiber树
    };
    // 在渲染的时候初始化
    deletions = [];

    nextUnitOfWork = wipRoot; // 初始化时指向wipRoot，第一个工作单元
  }

  // 工作循环函数，用来执行工作单元，浏览器空闲的时候调用
  function workLoop(deadline) {
    // shouldYield用于判断当前工作是否应该暂停
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      // 关键点：检查是否需要让出主线程
      shouldYield = deadline.timeRemaining() < 1;
    }

    if (!nextUnitOfWork && wipRoot) {
      commitRoot();
    }
    requestIdleCallback(workLoop);
  }

  requestIdleCallback(workLoop);

  // 处理单个工作单元的函数
  function performUnitOfWork(fiber) {
    // 判断是否是函数组件
    const isFunctionComponent = fiber.type instanceof Function;
    if (isFunctionComponent) {
      updateFunctionComponent(fiber);
    } else {
      updateHostComponent(fiber);
    }

    // 有子节点处理第一个子节点
    if (fiber.child) {
      return fiber.child;
    }
    // 没有子节点检查当前节点的兄弟节点
    let nextFiber = fiber;
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling;
      }
      // 没有就找父节点的下一个兄弟节点
      nextFiber = nextFiber.return;
    }
  }

  let wipFiber = null;
  let stateHookIndex = null;

  // 处理函数组件
  function updateFunctionComponent(fiber) {
    wipFiber = fiber;
    stateHookIndex = 0;
    wipFiber.stateHooks = [];
    wipFiber.effectHooks = [];

    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
  }

  // 处理非函数组件
  function updateHostComponent(fiber) {
    if (!fiber.dom) {
      fiber.dom = createDom(fiber);
    }
    reconcileChildren(fiber, fiber.props.children);
  }

  function createDom(fiber) {
    const dom =
      fiber.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type);

    updateDom(dom, {}, fiber.props);

    return dom;
  }

  const isEvent = (key) => key.startsWith("on");
  const isProperty = (key) => key !== "children" && !isEvent(key);
  const isNew = (prev, next) => (key) => prev[key] !== next[key];
  const isGone = (prev, next) => (key) => !(key in next);

  function updateDom(dom, prevProps, nextProps) {
    Object.keys(prevProps)
      .filter(isEvent)
      .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
      .forEach((name) => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
      });

    Object.keys(prevProps)
      .filter(isProperty)
      .filter(isGone(prevProps, nextProps))
      .forEach((name) => {
        dom[name] = "";
      });

    Object.keys(nextProps)
      .filter(isProperty)
      .filter(isNew(prevProps, nextProps))
      .forEach((name) => {
        dom[name] = nextProps[name];
      });

    Object.keys(nextProps)
      .filter(isEvent)
      .filter(isNew(prevProps, nextProps))
      .forEach((name) => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
      });
  }

  function reconcileChildren(wipFiber, elements) {
    let index = 0;
    let oldFiber = wipFiber.alternate?.child;
    let prevSibling = null;

    while (index < elements.length || oldFiber != null) {
      const element = elements[index];
      let newFiber = null;

      const sameType = element?.type == oldFiber?.type;

      if (sameType) {
        newFiber = {
          type: oldFiber.type,
          props: element.props,
          dom: oldFiber.dom,
          return: wipFiber,
          alternate: oldFiber,
          effectTag: "UPDATE",
        };
      }
      if (element && !sameType) {
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          return: wipFiber,
          alternate: null,
          effectTag: "PLACEMENT",
        };
      }
      if (oldFiber && !sameType) {
        oldFiber.effectTag = "DELETION";
        deletions.push(oldFiber);
      }

      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }

      if (index === 0) {
        wipFiber.child = newFiber;
      } else if (element) {
        prevSibling.sibling = newFiber;
      }

      prevSibling = newFiber;
      index++;
    }
  }

  function useState(initialState) {
    const currentFiber = wipFiber;

    const oldHook = wipFiber.alternate?.stateHooks[stateHookIndex];

    const stateHook = {
      state: oldHook ? oldHook.state : initialState,
      queue: oldHook ? oldHook.queue : [],
    };

    stateHook.queue.forEach((action) => {
      stateHook.state = action(stateHook.state);
    });

    stateHook.queue = [];

    stateHookIndex++;
    wipFiber.stateHooks.push(stateHook);

    function setState(action) {
      const isFunction = typeof action === "function";

      stateHook.queue.push(isFunction ? action : () => action);

      wipRoot = {
        ...currentFiber,
        alternate: currentFiber,
      };
      nextUnitOfWork = wipRoot;
    }

    return [stateHook.state, setState];
  }

  function useEffect(callback, deps) {
    const effectHook = {
      callback,
      deps,
      cleanup: undefined,
    };
    wipFiber.effectHooks.push(effectHook);
  }

  // 实际上是在做commit阶段的事情：将更改应用到真实的 DOM 中，并处理所有副作用
  function commitRoot() {
    // 删除操作
    deletions.forEach(commitWork);
    // 提交子节点
    commitWork(wipRoot.child);
    // 提交副作用
    commitEffectHooks();
    // 更新当前根节点
    currentRoot = wipRoot;
    // 清理
    wipRoot = null;
    deletions = [];
  }

  function commitWork(fiber) {
    if (!fiber) {
      return;
    }

    let domParentFiber = fiber.return;
    while (!domParentFiber.dom) {
      domParentFiber = domParentFiber.return;
    }
    const domParent = domParentFiber.dom;

    if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
      domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
      updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag === "DELETION") {
      commitDeletion(fiber, domParent);
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
  }

  function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
      domParent.removeChild(fiber.dom);
    } else {
      commitDeletion(fiber.child, domParent);
    }
  }

  function isDepsEqual(deps, newDeps) {
    if (deps.length !== newDeps.length) {
      return false;
    }

    for (let i = 0; i < deps.length; i++) {
      if (deps[i] !== newDeps[i]) {
        return false;
      }
    }
    return true;
  }

  function commitEffectHooks() {
    function runCleanup(fiber) {
      if (!fiber) return;

      fiber.alternate?.effectHooks?.forEach((hook, index) => {
        const deps = fiber.effectHooks[index].deps;

        if (!hook.deps || !isDepsEqual(hook.deps, deps)) {
          hook.cleanup?.();
        }
      });

      runCleanup(fiber.child);
      runCleanup(fiber.sibling);
    }

    function run(fiber) {
      if (!fiber) return;

      fiber.effectHooks?.forEach((newHook, index) => {
        if (!fiber.alternate) {
          newHook.cleanup = newHook.callback();
          return;
        }

        if (!newHook.deps) {
          newHook.cleanup = newHook.callback();
        }

        if (newHook.deps.length > 0) {
          const oldHook = fiber.alternate?.effectHooks[index];

          if (!isDepsEqual(oldHook.deps, newHook.deps)) {
            newHook.cleanup = newHook.callback();
          }
        }
      });

      run(fiber.child);
      run(fiber.sibling);
    }

    runCleanup(wipRoot);
    run(wipRoot);
  }

  const MiniReact = {
    createElement,
    render,
    useState,
    useEffect,
  };

  window.MiniReact = MiniReact;
})();
