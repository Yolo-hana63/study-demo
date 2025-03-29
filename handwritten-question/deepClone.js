function deepClone(obj, map = new WeakMap()) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  // 处理循环引用
  if (map.has(obj)) {
    return map.get(obj);
  }

  const newObject = Array.isArray(obj) ? [] : {};

  map.set(obj, newObject);

  // 可以使用Object.keys()代替for..in + hasOwnproperty()
  // Object.keys(obj).forEach((key) => {});

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        newObject[key] = deepClone(obj[key], map);
      } else {
        newObject[key] = obj[key];
      }
    }
  }

  return newObject;
}

const res = deepClone([1, 2, [3, [4, 5, [6]]]]);
console.log(res);

console.log(JSON.stringify(res, null, 2));

// 输出结果是[ 1, 2, [ 3, [ 4, 5, [Array] ] ] ]
// 展示Array简洁展示深度嵌套的结构
// Json.stringfy的三个参数：
//  res 是要被转换的对象。
// null 表示不做任何替换或过滤。
// 2 表示输出的 JSON 字符串会使用每层两个空格的缩进格式
