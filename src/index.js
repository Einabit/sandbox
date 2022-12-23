const { readFileSync } = require("fs");
const generator = require("./generator");
const fswrapper = require("./fs-wrapper");
const rawconfig = readFileSync("./config.yml");
const yp = require("yaml-parser");
const contents = yp.safeLoad(rawconfig);
const net = require("net");

const { tap, fetch, value } = require("./commands");

generator.start(contents);
net.createServer(connection => {

  connection.on("data", b => {
    const [command, ...args] = b.toString().split(",");

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
}).listen(1337, "127.0.0.1");
