function common() {
  const obj1 = {
    name: "jack",
    age: 20
  };
  const obj2 = {
    sex: "woman"
  };
  const copyObj = Object.assign(obj1, obj2);
  console.log(copyObj);
}
common();
