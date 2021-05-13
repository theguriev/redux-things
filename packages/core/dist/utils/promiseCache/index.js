"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preFethPromise = exports.promiseCache = exports.preFetchCache = exports.cache = void 0;

var _objectHash = _interopRequireDefault(require("object-hash"));

var _flow = require("../flow");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cache = new Map();
exports.cache = cache;
const preFetchCache = new Map();
/**
 * Get promise from preFetch cache if it's possible and run fn if not.
 */

exports.preFetchCache = preFetchCache;

const preFetchOrFetch = (hash, fn) => {
  if (preFetchCache.has(hash)) {
    const preFetchedPromise = preFetchCache.get(hash);
    preFetchCache.delete(hash);
    return preFetchedPromise;
  }

  return fn();
};

const removePromiseFromCache = hash => result => {
  cache.delete(hash);
  return result;
};

const promiseCache = _ref => {
  let {
    options,
    promiseFn,
    onStart = () => {},
    onSuccess = () => {},
    onError = () => {}
  } = _ref;
  const hash = (0, _objectHash.default)(options, {
    unorderedObjects: true
  });

  if (cache.has(hash)) {
    return cache.get(hash);
  }

  onStart();
  const promise = preFetchOrFetch(hash, () => promiseFn(options));
  cache.set(hash, promise);
  return promise.then((0, _flow.flow)(onSuccess, removePromiseFromCache(hash))).catch(onError);
};
/**
 * Put promise into preFetch cache.
 */


exports.promiseCache = promiseCache;

const preFethPromise = _ref2 => {
  let {
    options,
    promiseFn
  } = _ref2;
  const hash = (0, _objectHash.default)(options, {
    unorderedObjects: true
  });

  if (preFetchCache.has(hash)) {
    return preFetchCache.get(hash);
  }

  const promise = promiseFn(options);
  preFetchCache.set(hash, promise);
  return promise;
};

exports.preFethPromise = preFethPromise;
promiseCache.cache = cache;
promiseCache.preFetchCache = preFetchCache;