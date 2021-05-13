"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toFunction = exports.isFunction = void 0;

const isFunction = value => typeof value === 'function';

exports.isFunction = isFunction;

const toFunction = value => isFunction(value) ? value : () => value;

exports.toFunction = toFunction;