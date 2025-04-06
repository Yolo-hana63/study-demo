// 得到后端传回的一组数据，他们的顺序是一一对应的,
// 请根据 date的值从小到大排序，得到新的data

function handleData(data) {
  const map = new Map();
  data.date.forEach((item, index) => {
    map.set(item, data.uv[index]);
  });
  const arr = data.date.sort((a, b) => new Date(a) - new Date(b));
  const newUv = [];
  arr.forEach((item) => {
    const uv = map.get(item);
    newUv.push(uv);
  });
  const res = {
    uv: [...newUv],
    data: [...arr],
  };
  return res;
}

let data = {
  uv: ["20", "16", "43", "16", "11", "13", "54"],
  date: [
    "2023-12-30",
    "2023-12-25",
    "2023-12-27",
    "2023-12-24",
    "2023-12-26",
    "2023-12-29",
    "2023-12-28",
  ],
};

const res = handleData(data);
console.log(res);
