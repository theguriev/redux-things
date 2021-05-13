"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxContextProvider = require("./reduxContextProvider");

Object.keys(_reduxContextProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _reduxContextProvider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _reduxContextProvider[key];
    }
  });
});