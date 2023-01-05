const generator = require("./generator");
const fswrapper = require("./fs-wrapper");
const { CONFIG } = process.env;
const yp = require("yaml-parser");
const contents = yp.safeLoad(CONFIG);
const net = require("net");

const { tap, fetch, value } = require("./commands");

generator.start(contents);
net.createServer(connection => {
  connection.on("data", b => {
    const [command, ...args] = b.toString().split(",");
    console.log("new connection received with command " + command);
    switch (command) {
      case "tap":
        tap(connection, args);
        break;
      case "fetch":
        fetch(connection, args);
        break;
      case "value":
        value(connection, args);
        break;
    }
  });
}).listen(1337);

console.log("Server started");
