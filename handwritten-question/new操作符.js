function customNew(Constructor, ...args) {
  // 1、创建新对象
  const newObj = {};

  // 2、新对象的_proto_指向构造函数的prototype
  newObj._proto_ = Constructor.prototype;

  // 3、调用构造函数，并将this绑定到新对象中
  const result = Constructor.apply(newObj, ...args);

  // 4、如果构造函数返回的是一个对象，返回该对象，否则返回新创建的对象
  return result instanceof Object ? result : newObj;
}
