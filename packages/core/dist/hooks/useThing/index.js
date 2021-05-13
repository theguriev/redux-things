"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useThing = void 0;

var _react = require("react");

var _reactRedux = require("react-redux");

var _utils = require("../../utils");

var _constants = require("../../constants");

var _utils2 = require("./utils");

var _useInjectReducer = require("../useInjectReducer");

var _useMounted = require("../useMounted");

var _useWindowFocus = require("../useWindowFocus");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const useThing = function useThing(key, fetchFn) {
  let {
    reducer = _utils2.defaultReducer,
    selector = _utils2.defaultSelector,
    initialData = () => null,
    getFetchMore = () => false,
    dataMapper = v => v,
    skip = false,
    cache = 'cache-first',
    options: externalOptions = null,
    reFetchOnWindowFocus = false
  } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const {
    hasFocus,
    isFirstTime
  } = (0, _useWindowFocus.useWindowFocus)(!reFetchOnWindowFocus);
  const canFetchMore = (0, _reactRedux.useSelector)(state => {
    var _state$key;

    return !!(state !== null && state !== void 0 && (_state$key = state[key]) !== null && _state$key !== void 0 && _state$key.canFetchMore);
  });
  const fetchMoreOptions = (0, _reactRedux.useSelector)(state => {
    var _state$key2;

    return state === null || state === void 0 ? void 0 : (_state$key2 = state[key]) === null || _state$key2 === void 0 ? void 0 : _state$key2.fetchMoreOptions;
  });
  const [{
    error,
    isLoading,
    isRefetching,
    cache: _cache,
    options
  }, setState] = (0, _react.useState)({
    isRefetching: false,
    isLoading: cache === 'no-cache',
    error: null,
    requestPromise: null,
    cache,
    options: fetchMoreOptions || externalOptions
  });
  const dispatch = (0, _reactRedux.useDispatch)();
  const initialDataFn = (0, _utils.toFunction)(initialData);
  const selectedData = (0, _reactRedux.useSelector)(state => selector(state, options, key));
  const data = _cache === 'no-cache' ? null : selectedData;
  const isInitial = data === null;
  const mountedRef = (0, _useMounted.useMounted)();
  const internalReducer = (0, _react.useCallback)((0, _utils.flow)((0, _utils2.entityReducer)(key), reducer(key)), [reducer, key]);
  const launch = (0, _react.useCallback)(launchOptions => (0, _utils.promiseCache)({
    options: typeof options === 'object' ? _objectSpread(_objectSpread({}, launchOptions), {}, {
      __ENTITY_KEY__: key
    }) : options,
    promiseFn: fetchFn,
    onStart: () => {
      dispatch({
        type: `${_constants.ENTITIES_NAMESPACE}/${key}/pending`,
        key
      });
      setState(state => _objectSpread(_objectSpread({}, state), {}, {
        isLoading: true,
        isRefetching: !!(launchOptions !== null && launchOptions !== void 0 && launchOptions.isRefetch)
      }));
    },
    onSuccess: payload => {
      const generatedFMOptions = getFetchMore(payload, selectedData, launchOptions);
      dispatch({
        type: `${_constants.ENTITIES_NAMESPACE}/${key}/fulfilled`,
        payload,
        fetchMoreOptions: generatedFMOptions,
        canFetchMore: !!generatedFMOptions,
        key
      });
      return payload;
    },
    onError: payload => {
      dispatch({
        type: `${_constants.ENTITIES_NAMESPACE}/${key}/error`,
        payload,
        key
      });
      return payload;
    }
  }).then(payload => {
    if (mountedRef.current) {
      setState(state => _objectSpread(_objectSpread({}, state), {}, {
        error: null,
        isLoading: false,
        isRefetching: false,
        cache: 'cache-first'
      }));
    }

    return payload;
  }).catch(catchedError => {
    if (!catchedError) {
      if (mountedRef.current) {
        setState(state => _objectSpread(_objectSpread({}, state), {}, {
          error: catchedError,
          isLoading: false,
          isRefetching: false,
          cache: 'cache-first'
        }));
      }

      return catchedError;
    }
  }), [fetchFn, getFetchMore, selectedData, setState]);
  const reFetch = (0, _react.useCallback)(() => launch(_objectSpread(_objectSpread({}, options), {}, {
    isRefetch: true
  })), [options]);
  const preFetch = (0, _react.useCallback)(function () {
    let extendOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return (0, _utils.preFethPromise)({
      options: typeof options === 'object' ? _objectSpread(_objectSpread({}, options), {}, {
        __ENTITY_KEY__: key
      }, extendOptions) : options,
      promiseFn: fetchFn
    });
  }, [options]);
  const fetchMore = (0, _react.useCallback)(newOptions => {
    if (canFetchMore === false) {
      return Promise.resolve();
    }

    return launch(newOptions || fetchMoreOptions);
  }, [fetchMoreOptions, canFetchMore, launch]); // If hook props change we need to update internal options state as
  // internal state might be different with prev props due to change by fetch more action

  (0, _react.useEffect)(() => {
    if (externalOptions) {
      setState(state => _objectSpread(_objectSpread({}, state), {}, {
        options: externalOptions
      }));
    }
  }, [JSON.stringify(externalOptions)]);
  (0, _react.useEffect)(() => {
    if (!error && !skip && (!isLoading || _cache === 'no-cache') && !data) {
      launch(options);
    }
  }, [skip, error, isLoading, data]);
  const raw = data || initialDataFn(options);
  const mappedData = dataMapper(raw, {
    isLoading,
    isRefetching,
    isInitial
  });
  (0, _useInjectReducer.useInjectReducer)(key, internalReducer);
  (0, _react.useEffect)(() => {
    if (reFetchOnWindowFocus && hasFocus && !isFirstTime) {
      reFetch();
    }
  }, [hasFocus, reFetchOnWindowFocus, isFirstTime]);
  return {
    error,
    isError: !!error,
    isLoading,
    isRefetching,
    isInitial,
    data: raw,
    mappedData,
    reFetch,
    fetchMore,
    preFetch,
    canFetchMore
  };
};

exports.useThing = useThing;
useThing.NAMESPACE = _constants.ENTITIES_NAMESPACE;