// 对象 Path 枚举
// 目标:给定一个对象，枚举出这个对象的所有路径，如:
// (a:{c:{e:{}}，d:{}}，b:{}}，输出:[["a","c","e"], ["a","d"],["b"]]

function getObjectPaths(obj, prefix = []) {
  let path = [];
  for (const key in obj) {
    const newPath = [...prefix, key];
    if (Object.keys(obj[key]).length === 0) {
      path.push(newPath);
    } else {
      path = path.concat(getObjectPaths(obj[key], newPath));
    }
  }
  return path;
}

// 示例对象
const inputObj = {
  a: { c: { e: {} }, d: {} },
  b: {},
};

console.log(getObjectPaths(inputObj));
