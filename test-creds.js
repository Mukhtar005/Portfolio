
const { verifyAdmin } = require("./server/store");
console.log("Testing credentials...");
console.log("Username: 1234, Password: Muktar →", verifyAdmin("1234", "Muktar"));
