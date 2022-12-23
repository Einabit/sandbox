const fswrapper = require("./fs-wrapper");

const self = {};

self.store = {};

self.start = function (contents) {
  Object.entries(contents).forEach(entry => {
    const [name, props] = entry;
    self.store[name] = props.value.min;
    setInterval(() => {
      if (self.yesno(props.interval.skip)) return;
      let aux = self.store[name];
      if ((self.store[name] - props.value.step) >= props.value.min && self.yesno())
        aux -= props.value.step;
      else if ((self.store[name] + props.value.step) <= props.value.max && !self.yesno())
        aux += props.value.step;
      if (aux === self.store[name]) return;
      self.store[name] = aux;
      fswrapper.commit(name, self.store[name]);
    }, props.interval.ms);
  });
}

self.yesno = function (yes = .5) {
  return Math.random() < yes;
}

self.randomized = function (range) {
  return parseInt(Math.random() * range);
}

self.norepeat = function (range, forbidden = 0) {
  let result = self.randomized(range + 1);
  if (result === forbidden) {
    if (result > 0) {
      return result - 1;
    } else if (result < range - 1) {
      return result + 1;
    }
  } else return result;
}

module.exports = self;
