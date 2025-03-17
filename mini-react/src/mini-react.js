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

const MiniReact = {
  createElement,
};

window.MiniReact = MiniReact;

// let nextUnitOfWork = null
// let workLoop = null
// let currentRoot = null
