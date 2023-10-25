const fswrapper = require("./fs-wrapper");

const self = {};

const EOL = "\n";

function cookLine (line) {
  const firstComaNdx = line.search(",");
  return line.substring(firstComaNdx + 1) + EOL;
}

self.fetch = function (connection, args) {
  const _variable = args[0];
  const _fromTs = parseInt(args[1]);
  const _toTs = parseInt(args[2]);

  fswrapper.filter(_variable, _fromTs, _toTs,
    data => connection.write(cookLine(data)), () => connection.end());
}

self.tap = function (connection, args) {
  const _variable = args[0];
  const _fromTs = args[1] ? parseInt(args[1]): undefined;

  if (_fromTs) {
    fswrapper.filter(_variable, _fromTs, Date.now(),
      data => connection.write(cookLine(data)), _ => _);
  }

  const tapCallback = newdata => {
    if (newdata.startsWith(_variable)) connection.write(cookLine(newdata));
  }

  fswrapper.evt.on("line", tapCallback);
  connection.on("end", () => fswrapper.evt.off("line", tapCallback));
}

self.value = function (connection, args) {
  const _variable = args[0];
  if (fswrapper.lastCommit[_variable]) {
    connection.write(cookLine(fswrapper.lastCommit[_variable]));
    connection.end();
  } else {
    fswrapper.lastValue(_variable).then(value => {
      connection.write(cookLine(value));
      connection.end();
    });
  }
}

self.last = function (connection, args) {
  const _variable = args[0];
  const _amount = parseInt(args[1]);
  fswrapper.limitValues(_variable, _amount, line =>
    connection.write(cookLine(line)), () => connection.end());
}

module.exports = self;
