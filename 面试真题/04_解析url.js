function parseUrlParams(url) {
  const params = new URL(url).searchParams;
  let result = {};
  for (let [key, value] of params) {
    if (result[key]) {
      result[key] = Array.isArray(result[key])
        ? [...result[key], value]
        : [result[key], value];
    } else {
      result[key] = value;
    }
  }
  return result;
}

// 示例
const url = "https://example.com?page=1&size=10&filter=name&filter=age";
console.log(parseUrlParams(url));
