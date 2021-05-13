"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flow = void 0;

var _this = void 0;

const flow = function flow() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  const {
    length
  } = funcs;
  return function (first) {
    let index = 0;

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    let result = length ? funcs[index].apply(_this, [first, ...args]) : first; // eslint-disable-next-line no-plusplus

    while (++index < length) {
      result = funcs[index].apply(_this, [result, ...args]);
    }

    return result;
  };
};

exports.flow = flow;