// 整数 -> 字符串 -> 数组
// 每一位相加 小于10 flag = 0
// 大于10 进位flag=1
// 判断最后一位相加是否需要进位
function bigNumberSum(str1, str2) {
  let arr1 = String(str1).split("").reverse();
  let arr2 = String(str2).split("").reverse();

  let flag = 0;
  let result = [];
  let maxLength = Math.max(arr1.length, arr2.length);
  for (let i = 0; i < maxLength; i++) {
    let num1 = Number(arr1[i]) || 0;
    let num2 = Number(arr2[i]) || 0;
    let sum = num1 + num2 + flag;

    if (sum < 10) {
      flag = 0;
    } else {
      sum = sum % 10;
      flag = 1;
    }
    result.push(sum);
    // 最后一位的情况
    if (i === maxLength - 1 && flag === 1) {
      result.push(flag);
    }
  }
  return result.reverse().join("");
}

const res = bigNumberSum(6453234253452432, 7326362323251323);
console.log(res);
