const { FILENAME = "./raw" } = process.env;
const EventEmitter = require("events");
const reverseReadStream = require("fs-reverse");
const { appendFile } = require("fs");

const self = {};

self.lastCommit = {};
self.evt = new EventEmitter;

self.lastValue = function (name) {
  return new Promise((resolve, reject) => {
    const rfs = reverseReadStream(FILENAME);
    rfs.on("data", data => {
      if (!data.startsWith(name)) return;
      else {
        rfs.destroy();
        resolve(data);
      }
    })
  });
}

self.filter = function (name, from, to, readLine, end) {
  const rfs = reverseReadStream(FILENAME);
  rfs.on("data", data => {
    if (!data.startsWith(name)) return;
    const ts = Number(data.split(",").pop());
    if (from <= ts && ts <= to) readLine(data);
  })

  rfs.on("end", end);
}

self.commit = function (name, data) {
  const line = [name, data, Date.now()].join();
  return new Promise((resolve, reject) => {
    appendFile(FILENAME, line + "\n", err => {
      if (err) reject(err)
      else {
        resolve();
        self.lastCommit[name] = line;
        self.evt.emit("line", line);
      }
    });
  });
}

module.exports = self;
