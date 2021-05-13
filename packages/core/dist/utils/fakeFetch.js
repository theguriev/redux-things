"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fakeFetch = void 0;

const fakeFetch = function fakeFetch(data) {
  let delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

exports.fakeFetch = fakeFetch;