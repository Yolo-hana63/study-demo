var search = function (nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    // Math.floor 向下取整函数
    let middle = Math.floor((left + right) / 2);
    if (nums[middle] < target) {
      left = middle + 1;
    } else if (nums[middle] > target) {
      right = middle - 1;
    } else {
      return middle;
    }
  }
  return -1;
};

// 时间复杂度：O(log n)
// 空间复杂度：O(1)

// 当left<right作为循环条件时
function search(nums, target) {
  let left = 0;
  let right = nums.length; // 注意这里要设置为 nums.length，而不是 nums.length - 1
  while (left < right) {
    // 改为 left < right
    let middle = Math.floor((left + right) / 2); // 计算中间值
    if (nums[middle] < target) {
      left = middle + 1;
    } else if (nums[middle] > target) {
      right = middle; // 这里改成 right = middle，而不是 right = middle - 1
    } else {
      return middle;
    }
  }
  return -1;
}
