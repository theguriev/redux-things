"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMounted = void 0;

var _react = require("react");

const useMounted = () => {
  const isMounted = (0, _react.useRef)(false);
  (0, _react.useEffect)(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
};

exports.useMounted = useMounted;