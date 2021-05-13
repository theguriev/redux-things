"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dictionaryReducer = void 0;

const dictionaryReducer = function dictionaryReducer(dict) {
  let def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (state, action) {
    const fn = dict[action.type];

    if (fn) {
      for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        rest[_key - 2] = arguments[_key];
      }

      return fn(state, action, ...rest);
    }

    return state || def;
  };
};

exports.dictionaryReducer = dictionaryReducer;