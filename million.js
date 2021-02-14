const init = require("init");

console.time();
for (let i = 0; i < 1e6; i++) {
  const result = init().play();
  if (result) {
    console.log("success", i);
    break;
  }
}
console.timeEnd();
