# 转换成 vdom

- jsx -> render function 由 babel、tsx 等编译器来做
- 简单实现了 React.createElement 函数，执行后返回的就是 React Element 树，也就是 vdom

  - 结构如下
      <div> 
      {
      "type": "div",
      "props": {
        "children": [
          {
            "type": "a",
            "props": {
              "href": "xxx",
              "children": [
                {
                  "type": "TEXT_ELEMENT",
                  "props": {
                    "nodeValue": "link",
                    "children": []
                  }
                }
              ]
            }
          }
        ]
      }
    }
      </div>

# 转换成 fiber 架构

  这个过程叫做 reconcile。
    
  它并不是一次性完成的，而是通过调度器调度，根据时间分片放到多个任务里完成，这里我们用 <strong>requestIdleCallback</strong>来调度。

## useState的state和useEffect的effect是应该存在哪里呢？
  一定是存在fiber上，因为fiber是组件的载体。可以用两个数组来存储