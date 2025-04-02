// 完成函数 flatten，接受数组作为参数，数组元素包含整数或数组，函数返回扁平化后的数组

// 递归
function flatten(arr) {
  let result = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      result.push(...flatten(item));
    } else {
      result.push(item);
    }
  });
  return result;
}

console.log(flatten([1, [2, [3, 4], 5], 6])); // [1, 2, 3, 4, 5, 6]

// 递归的每一层都会创建一个新的 result 数组。
// 但是 递归调用中的 result 是不同的局部变量，每一层的 result 只在该层有效，最终会将结果返回给上层，而上层的 result 不会被覆盖或丢失。

function flatten2(arr) {
  const res = arr.flat(Infinity); // 无限层级
  return res;
}

console.log(flatten2([1, [2, [3, 4], 5], 6])); // [1, 2, 3, 4, 5, 6]
