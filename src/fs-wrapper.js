const { FILENAME = "./raw" } = process.env;
const EventEmitter = require("events");
const reverseReadStream = require("fs-reverse");
const { appendFile, readFile } = require("fs");

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

self.limitValues = function (name, limit, readLine, end) {
  const result = [];
  let destroyed = false;
  function destroy () {
    if (!destroyed) {
      destroyed = true;
      rfs.destroy();
      result.forEach(readLine);
      end();
    }
  }
  const rfs = reverseReadStream(FILENAME);
  rfs.on("data", data => {
    if (result.length < limit && data.startsWith(name)) {
      result.unshift(data + "\n");
      if (result.length >= limit) destroy();
    }
  })
  rfs.on("end", destroy);
}

self.filter = function (name, from, to, readLine, end) {

  readFile(FILENAME, "utf8", (err, data) => {
    if (err) throw err;
    const lines = data.split("\n");

    for (let line of lines) {
      if (!line.startsWith(name)) continue;
      const ts = Number(line.split(",")[1]);
      if (from <= ts && ts <= to) {
        readLine(line + "\n");
      }
    }

    end();

  });
}

self.commit = function (name, data) {
  const line = [name, Date.now(), data].join();
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
