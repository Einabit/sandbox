const generator = require("./generator");
const fswrapper = require("./fs-wrapper");
const { CONFIG, PASSPHRASE } = process.env;
const yp = require("yaml-parser");
const contents = yp.safeLoad(CONFIG);
const net = require("net");
const crypto = require("crypto");

function decrypt(combinedData, key) {
  const iv = Buffer.from(combinedData.slice(0, 32), "hex");
  const ciphertext = combinedData.slice(32);
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(ciphertext, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

const { tap, fetch, value, last } = require("./commands");

generator.start(contents);
net.createServer(connection => {
  connection.on("data", b => {
    let auxdata = b.toString();
    let command = "", args = [];
    try {
      if (PASSPHRASE) auxdata = decrypt(auxdata, PASSPHRASE);
      const aux = auxdata.split(",");
      command = aux.shift();
      args = aux;
    } catch (e) {
      return connection.end();
    }
    console.log("new connection received with command " + command + " args: " + args.join());
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
      case "last":
        last(connection, args);
        break;
      default:
        connection.end();
    }
  });
}).listen(1337);

console.log("Server started");
