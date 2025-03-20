function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode =
          typeof child === 'string' || typeof child === 'number';
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

// 单独处理文本，因为他没有type,props,children
function createTextNode(nodeValue) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue,
      children: [],
    },
  };
}

const MiniReact = {
  createElement,
};

window.MiniReact = MiniReact;

// 全局保存状态，即使工作被中断，状态也会保留
let nextUnitOfWork = null; // 下一个工作单元
let wipRoot = null; // 正在处理的fiber的根节点
let currentRoot = null; // 之前历史的fiber链表的根节点
let deletions = null // 要删除的节点

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
  
  nextUnitOfWork = wipRoot; // 第一个工作单元
}

// 工作循环函数，用来执行工作单元，浏览器空闲的时候调用
function workloop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 关键点：检查是否需要让出主线程
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workloop);
}

// 处理单个工作单元的函数
function performUnitOfWork(fiber) {
  // 判断是否是函数组件
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

let wipFiber = null; // 当前正在工作的函数组件fiber
let stateHookindex = null; // 当前组件的hook索引

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  stateHookindex = null;
  wipFiber.stateHooks = []; // 存储state和effect的hooks
  wipFiber.effectHooks = [];

  const children = [fiber.type(fiber.props)]; // 执行函数获取渲染内容
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber); // 创建dom元素
  }

  reconcileChildren(fiber, fiber.props.children);
}

function createDom(fiber) {
  const dom =
    fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

// 判断是不是事件处理器
const isEvent = (key) => key.startsWith('on');
// 判断属性值是否改变
const isNew = (prev, next) => (key) => prev[key] !== next[key];
// 判断是不是普通的属性(非事件处理器，也不是children属性)
const isProperty = (key) => !isEvent(key) && key !== 'children';
// 判断属性是否删除
const isGone = (prev, next) => (key) => key in prev && !(key in next);

function updateDom(dom, prevProps, nextProps) {
  // 1、移除旧的获变化的事件监听器
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 2、移除旧的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = '';
    });

  // 3、添加新的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // 4、添加新的事件监听器
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

// 处理子节点（比较和更新组件树）
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate?.child; //旧树的第一个子节点
  let prevSibling = null; // 构建兄弟节点连接

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    // 比较新旧节点类型
    const sameType = element?.type == oldFiber?.type;

    // 1、相同类型： 更新节点
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props, // 使用新的 props
        dom: oldFiber.dom, // 复用旧的 DOM
        return: wipFiber, // 指向父节点
        alternate: oldFiber, // 指向旧节点
        effectTag: 'UPDATE', // 标记为更新
      };
    }

    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null, // 新建的节点还没有 DOM
        return: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT', // 标记为插入
      };
    }

    // 3. 旧节点：删除节点
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION'; // 标记为删除
      deletions.push(oldFiber); // 加入删除队列
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
