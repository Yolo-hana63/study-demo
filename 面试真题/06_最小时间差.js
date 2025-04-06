var findMinDifference = function (timePoints) {
  let arr = [];
  // 不可以是null，比较min的时候会是NaN,可能输出的时候结果是0
  let minMinutes = Infinity;
  timePoints.forEach((item) => {
    const [HH, MM] = item.split(":");
    let res = Number(HH * 60) + Number(MM);
    arr.push(res);
  });
  arr.sort((a, b) => a - b);
  console.log(arr);
  for (let i = 1; i < arr.length; i++) {
    minMinutes = Math.min(minMinutes, arr[i] - arr[i - 1]);
  }

  let wrapMin = Number(arr[0]) + 1440 - Number(arr[arr.length - 1]);
  minMinutes = Math.min(minMinutes, wrapMin);
  return minMinutes;
};

console.log(findMinDifference(["23:59", "00:00"]));
