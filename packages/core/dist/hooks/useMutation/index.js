"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMutation = void 0;

var _react = require("react");

var _reactRedux = require("react-redux");

var _utils = require("../../utils");

var _constants = require("../../constants");

var _useMounted = require("../useMounted");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const useMutation = function useMutation(promiseFn) {
  let {
    mutationKey = 'global'
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const [{
    isLoading,
    error,
    data
  }, setState] = (0, _react.useState)({
    error: null,
    isLoading: false,
    data: null
  });
  const mountedRef = (0, _useMounted.useMounted)();
  const dispatch = (0, _reactRedux.useDispatch)();
  const mutate = (0, _react.useCallback)(function () {
    let launchOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return (0, _utils.promiseCache)({
      options: _objectSpread(_objectSpread({}, launchOptions), {}, {
        __ENTITY_KEY__: mutationKey
      }),
      promiseFn,
      onStart: () => {
        dispatch({
          type: `${_constants.ENTITIES_NAMESPACE}/mutate/${mutationKey}/pending`,
          key: mutationKey
        });
        setState(state => _objectSpread(_objectSpread({}, state), {}, {
          isLoading: true
        }));
      },
      onSuccess: payload => {
        dispatch({
          type: `${_constants.ENTITIES_NAMESPACE}/mutate/${mutationKey}/fulfilled`,
          payload,
          key: mutationKey
        });
        return payload;
      },
      onError: payload => {
        dispatch({
          type: `${_constants.ENTITIES_NAMESPACE}/mutate/${mutationKey}/error`,
          payload,
          key: mutationKey
        });
        return payload;
      }
    }).then(payload => {
      if (mountedRef.current) {
        setState(state => _objectSpread(_objectSpread({}, state), {}, {
          error: null,
          isLoading: false
        }));
      }

      return payload;
    }).catch(catchedError => {
      if (!catchedError) {
        if (mountedRef.current) {
          setState(state => _objectSpread(_objectSpread({}, state), {}, {
            error: catchedError,
            isLoading: false
          }));
        }

        return catchedError;
      }
    });
  }, [promiseFn, mutationKey, setState]);
  return {
    isLoading,
    isError: !!error,
    error,
    data,
    mutate
  };
};

exports.useMutation = useMutation;