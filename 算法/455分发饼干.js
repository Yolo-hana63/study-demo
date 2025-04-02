// 大饼干喂大胃口
var findContentChildren = function (g, s) {
  let newG = g.sort((a, b) => a - b);
  let newS = s.sort((a, b) => a - b);

  let res = 0;
  let index = newS.length - 1;

  for (let i = newG.length - 1; i >= 0; i--) {
    if (index >= 0 && newS[index] >= newG[i]) {
      res++;
      index--;
    }
  }
  return res;
};
