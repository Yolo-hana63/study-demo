// Set方法
function unique(arr) {
  return [...new Set(arr)];
}

console.log(unique([1, 2, 2, 3, 4, 4, 5]));

// forEach + includes
function unique2(arr) {
  const res = [];
  arr.forEach((item) => {
    if (!res.includes(item)) {
      res.push(item);
    }
  });
  return res;
}
console.log(unique2([1, 2, 2, 3, 4, 4, 5]));

// filter+indexOf
function unique3(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

console.log(unique3([1, 2, 2, 3, 4, 4, 5]));
