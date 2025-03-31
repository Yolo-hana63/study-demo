// fs 是 Node.js 提供的文件系统模块，用于读取和写入文件
const fs = require("fs");
const babel = require("@babel/core");

// 读取文件
fs.readFile("./element.js", (error, data) => {
  // 将 Buffer 形式转换成字符串解析文件内容
  const code = data.toString("utf-8");

  //用插件转换
  const result = babel.transformSync(code, {
    plugins: ["@babel/plugin-transform-react-jsx"],
  });

  // 将转换后的result.code写回element.js文件，回调函数为空就是写入后不执行额外操作
  fs.writeFile("./element.js", result.code, function () {});
});
