// 二维实现
function knapsack(n, bagweight, weight, value) {
  // 构建二维数组
  let dp = Array.from({ length: n }, () => Array(bagweight + 1).fill(0));

  // 初始化第一行
  for (let j = weight[0]; j <= bagweight; j++) {
    dp[0][j] = value[0];
  }

  // 计算DP表
  for (let i = 1; i < n; i++) {
    for (let j = 0; j <= bagweight; j++) {
      if (j < weight[i]) {
        dp[i][j] = dp[i - 1][j];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i]);
      }
    }
  }

  return dp[n - 1][bagweight];
}

const res = knapsack(3, 4, [2, 1, 3], [4, 2, 3]);
console.log(res);
