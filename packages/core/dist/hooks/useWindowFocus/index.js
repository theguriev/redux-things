"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useWindowFocus = exports.EVENT_NAME = exports.getEventName = void 0;

var _react = require("react");

const getEventName = () => {
  if (document.msHidden) {
    return 'msvisibilitychange';
  }

  if (document.webkitvisibilitychange) {
    return 'webkitvisibilitychange';
  }

  return 'visibilitychange';
};

exports.getEventName = getEventName;
const EVENT_NAME = getEventName();
exports.EVENT_NAME = EVENT_NAME;

const hasFocusFn = () => document.visibilityState === 'visible';

const useWindowFocus = function useWindowFocus() {
  let skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  const [state, setState] = (0, _react.useState)({
    hasFocus: hasFocusFn(),
    isFirstTime: true
  });

  const handleFocus = () => setState({
    hasFocus: hasFocusFn(),
    isFirstTime: false
  });

  (0, _react.useEffect)(() => {
    // Listen to visibillitychange and focus
    if (typeof window !== 'undefined' && window.addEventListener && !skip) {
      document.addEventListener(EVENT_NAME, handleFocus, false);
      document.addEventListener('focus', handleFocus, false);
    }

    return () => {
      // Be sure to unsubscribe if a new handler is set
      document.removeEventListener(EVENT_NAME, handleFocus);
      document.removeEventListener('focus', handleFocus);
    };
  }, []);
  return state;
};

exports.useWindowFocus = useWindowFocus;