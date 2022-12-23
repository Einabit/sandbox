const fswrapper = require("./fs-wrapper");

const self = {};

self.fetch = function (connection, args) {
  const _variable = args[0];
  const _fromTs = parseInt(args[1]);
  const _toTs = parseInt(args[2]);

  fswrapper.filter(_variable, _fromTs, _toTs,
    data => connection.write(data), () => connection.end());
}

self.tap = function (connection, args) {
  const _variable = args[0];
  const _fromTs = args[1] ? parseInt(args[1]): undefined;

  if (_fromTs) {
    fswrapper.filter(_variable, _fromTs, Date.now(),
      data => connection.write(data), _ => _);
  }

  const tapCallback = newdata => {
    if (newdata.startsWith(_variable)) connection.write(newdata);
  }

  fswrapper.evt.on("line", tapCallback);
  connection.on("end", () => fswrapper.evt.off("line", tapCallback));
}

self.value = function (connection, args) {
  const _variable = args[0];
  if (fswrapper.lastCommit[_variable]) {
    connection.write(fswrapper.lastCommit[_variable]);
    connection.end();
  } else {
    fswrapper.lastValue(_variable).then(value => {
      connection.write(value);
      connection.end();
    });
  }
}

module.exports = self;
