// var lengthOfLongestSubstring = function (s) {
//   let maxLength = 0;
//   let arr = [];
//   for (let i = 0; i < s.length - maxLength; i++) {
//     let curLength = 1;
//     arr = [s[i]];
//     for (let j = i + 1; j < s.length; j++) {
//       if (!arr.includes(s[j])) {
//         arr.push(s[j]);
//         curLength++;
//       } else {
//         break;
//       }
//     }
//     maxLength = Math.max(curLength, maxLength);
//   }
//   return maxLength;
// };

// var lengthOfLongestSubstring = function (s) {
//   let maxLength = 0;
//   let map = new Map();
//   let left = 0;
//   let right = 0;
//   while (left < s.length - maxLength) {
//     let curLength = 1;
//     map.clear();
//     map.set(s[left], true);
//     right = left + 1;
//     while (!map.has(s[right]) && right < s.length) {
//       map.set(s[right], true);
//       curLength++;
//       right++;
//     }
//     maxLength = Math.max(curLength, maxLength);
//     left++;
//   }
//   return maxLength;
// };

var lengthOfLongestSubstring = function (s) {
  let maxLength = 0;
  let set = new Set();
  let left = 0;
  let right = 0;
  while (left < s.length - maxLength) {
    let curLength = 1;
    set.add(s[left]);
    right = left + 1;
    while (!set.has(s[right]) && right < s.length) {
      set.add(s[right]);
      curLength++;
      right++;
    }
    maxLength = Math.max(curLength, maxLength);
    set.delete(s[left]);
    left++;
  }
  return maxLength;
};

const res = lengthOfLongestSubstring(" ");
console.log(res);
