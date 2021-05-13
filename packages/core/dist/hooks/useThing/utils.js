"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.entityReducer = exports.defaultSelector = exports.defaultReducer = void 0;

var _lodashEs = require("lodash-es");

var _constants = require("../../constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const defaultReducer = key => (state, _ref) => {
  let {
    type,
    payload: data
  } = _ref;

  if (type === `${_constants.ENTITIES_NAMESPACE}/${key}/fulfilled`) {
    return _objectSpread(_objectSpread({}, state), {}, {
      data
    });
  }

  return state || {};
};

exports.defaultReducer = defaultReducer;

const defaultSelector = (state, _options, key) => {
  var _state$key;

  return (state === null || state === void 0 ? void 0 : (_state$key = state[key]) === null || _state$key === void 0 ? void 0 : _state$key.data) || null;
};

exports.defaultSelector = defaultSelector;

const entityReducer = key => (state, _ref2) => {
  let {
    type,
    fetchMoreOptions,
    canFetchMore
  } = _ref2;
  const targetType = `${_constants.ENTITIES_NAMESPACE}/${key}/fulfilled`;
  const removeFetchMoreOptionsType = `${_constants.ENTITIES_NAMESPACE}/${key}/removeFetchMoreOptions`;

  if (type === targetType) {
    return _objectSpread(_objectSpread({}, state), {}, {
      fetchMoreOptions,
      canFetchMore
    });
  }

  if (type === removeFetchMoreOptionsType) {
    return (0, _lodashEs.omit)(state, ['fetchMoreOptions', 'canFetchMore']);
  }

  return state || {};
};

exports.entityReducer = entityReducer;