const generator = require("./generator");
const fswrapper = require("./fs-wrapper");
const { CONFIG, PASSPHRASE } = process.env;
const yp = require("yaml-parser");
const contents = yp.safeLoad(CONFIG);
const net = require("net");
const crypto = require("crypto");

const EOL = "\n";

function decrypt(combinedData, key) {
  const iv = Buffer.from(combinedData.slice(0, 32), "hex");
  const ciphertext = combinedData.slice(32);
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(ciphertext, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

const { tap, fetch, value, last } = require("./commands");

function commitCommand (connection, command) {
    const args = command.split(",");
    const prefix = args.shift();
    switch (prefix) {
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
}


generator.start(contents);
net.createServer(connection => {
  let auxCommandPackets = [];
  console.log("New connection started");
  connection.on("end", () => console.log("Connection ended by peer"));
  connection.on("data", b => {
    const auxdata = b.toString();
    auxCommandPackets.push(auxdata);
    if (auxdata.endsWith(EOL)) {
      let auxstr = auxCommandPackets.join("").trim();
      try {
        if (PASSPHRASE) auxstr = decrypt(auxstr, PASSPHRASE);
      } catch (e) {
        console.log(e);
        return connection.end();
      }

      console.log("Received command " + auxstr);
      commitCommand(
        connection,
        auxstr
      );
    }
  });
}).listen(1337);

console.log("Server started");
