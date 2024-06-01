const { httpServer } = require("./src/app");

const port = process.env.PORT || 3000;

httpServer.listen(port);
console.log("Sever connected port ", port);
