// 用队列
var levelOrder = function (root) {
  let result = [];
  if (!root) return result;

  let queue = [root];
  while (queue.length) {
    // 每一层的
    let curLevel = [];
    // 记录每一层的个数
    let size = queue.length;
    while (size--) {
      let cur = queue.shift();
      curLevel.push(cur.val);
      if (cur.left) {
        queue.push(cur.left);
      }
      if (cur.right) {
        queue.push(cur.right);
      }
    }
    result.push(curLevel);
  }
  return result;
};
