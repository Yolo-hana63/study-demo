function sort(nums) {
  for (let i = 0; i < nums.length - 1; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      // 这里的比较逻辑我是i和j，标准的逻辑好像是j和j+1比较相邻的
      if (nums[i] < nums[j]) {
        let temp = nums[j];
        nums[j] = nums[i];
        nums[i] = temp;
      }
    }
  }
  return nums;
}

let res = sort([3, 9, 7, 6, 2, 1]);
console.log(res);

// 优化代码：

// function sort(nums) {
//     for (let i = 0; i < nums.length - 1; i++) {
//       // 优化：加入标志位，如果某一轮没有交换，提前结束
//       let swapped = false;
//       for (let j = 0; j < nums.length - 1 - i; j++) {  // 每轮减少比较次数
//         if (nums[j] > nums[j + 1]) { // 如果前面的数大于后面的数，交换
//           // 交换 nums[j] 和 nums[j + 1]
//           let temp = nums[j];
//           nums[j] = nums[j + 1];
//           nums[j + 1] = temp;
//           swapped = true;
//         }
//       }
//       // 如果没有交换，表示数组已经是有序的，提前退出
//       if (!swapped) {
//         break;
//       }
//     }
//     return nums;
//   }
