"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduxContextProvider = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _hooks = require("../hooks");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const store = (0, _hooks.setupAsyncReducers)((0, _redux.createStore)(v => v), {});

const reduxContextProvider = _ref => {
  let {
    children
  } = _ref;
  return /*#__PURE__*/_react.default.createElement(_reactRedux.Provider, {
    store: store
  }, children);
};

exports.reduxContextProvider = reduxContextProvider;