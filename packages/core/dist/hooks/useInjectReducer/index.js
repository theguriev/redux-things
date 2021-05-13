"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useInjectReducer = exports.setupAsyncReducers = void 0;

var _react = require("react");

var _reactRedux = require("react-redux");

var _lodashEs = require("lodash-es");

var _toolkit = require("@reduxjs/toolkit");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const setupAsyncReducers = (store, staticReducer) => {
  store.asyncReducers = {};

  store.updateReducer = () => {
    store.replaceReducer((0, _toolkit.combineReducers)(_objectSpread(_objectSpread({}, staticReducer), store.asyncReducers)));
  };

  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer;
    store.updateReducer();
  };

  store.withdrawReducer = key => {
    store.asyncReducer = (0, _lodashEs.omit)(store.asyncReducers, [key]);
    store.updateReducer();
  };

  return store;
};

exports.setupAsyncReducers = setupAsyncReducers;

const useInjectReducer = (key, reducer) => {
  const store = (0, _reactRedux.useStore)();
  (0, _react.useEffect)(() => {
    if (!store.asyncReducers[key]) {
      store.injectReducer(key, reducer);
    }

    return () => {
      store.withdrawReducer(key);
    };
  }, []);
  return store;
};

exports.useInjectReducer = useInjectReducer;