function throttle(fn, wait) {
  let timer = null;
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, wait);
    }
  };
}

function newThrottle(fn, wait) {
  let lastTime = Date.now();
  return function (...args) {
    let curTime = Date.now();
    if (curTime - lastTime >= wait) {
      fn.apply(this, args);
      lastTime = curTime;
    }
  };
}
