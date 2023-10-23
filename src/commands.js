const fswrapper = require("./fs-wrapper");

const self = {};

function removeName (line) {
  const firstComaNdx = line.search(",");
  return line.substring(firstComaNdx + 1);
}

self.fetch = function (connection, args) {
  const _variable = args[0];
  const _fromTs = parseInt(args[1]);
  const _toTs = parseInt(args[2]);

  fswrapper.filter(_variable, _fromTs, _toTs,
    data => connection.write(removeName(data)), () => connection.end());
}

self.tap = function (connection, args) {
  const _variable = args[0];
  const _fromTs = args[1] ? parseInt(args[1]): undefined;

  if (_fromTs) {
    fswrapper.filter(_variable, _fromTs, Date.now(),
      data => connection.write(removeName(data)), _ => _);
  }

  const tapCallback = newdata => {
    if (newdata.startsWith(_variable)) connection.write(removeName(newdata));
  }

  fswrapper.evt.on("line", tapCallback);
  connection.on("end", () => fswrapper.evt.off("line", tapCallback));
}

self.value = function (connection, args) {
  const _variable = args[0];
  if (fswrapper.lastCommit[_variable]) {
    connection.write(removeName(fswrapper.lastCommit[_variable]));
    connection.end();
  } else {
    fswrapper.lastValue(_variable).then(value => {
      connection.write(removeName(value));
      connection.end();
    });
  }
}

self.last = function (connection, args) {
  const _variable = args[0];
  const _amount = parseInt(args[1]);
  fswrapper.limitValues(_variable, _amount, line =>
    connection.write(removeName(line)), () => connection.end());
}

module.exports = self;
