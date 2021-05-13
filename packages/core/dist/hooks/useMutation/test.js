"use strict";

var _reactHooks = require("@testing-library/react-hooks");

var _mocks = require("../../mocks");

var _ = require("../..");

describe('useMutation', () => {
  test('basic scenario', async () => {
    const {
      result,
      waitForValueToChange
    } = (0, _reactHooks.renderHook)(() => (0, _.useMutation)(() => Promise.resolve('Hello 😇')), {
      wrapper: _mocks.reduxContextProvider
    });
    await waitForValueToChange(() => result.current.isLoading);
    expect(1).toBe(1);
  });
});