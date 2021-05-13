"use strict";

var _reactHooks = require("@testing-library/react-hooks");

var _mocks = require("../../mocks");

var _2 = require("../..");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe('useThing', () => {
  test('basic scenario', async () => {
    const {
      result,
      waitForValueToChange
    } = (0, _reactHooks.renderHook)(() => (0, _2.useThing)('EWhateverEntity', () => Promise.resolve('hello world')), {
      wrapper: _mocks.reduxContextProvider
    }, {
      options: {
        helloWorld: true
      }
    });
    await waitForValueToChange(() => result.current.isLoading);
    expect(result.all).toMatchSnapshot();
  });
  test('getting from the cache', async () => {
    const {
      result
    } = (0, _reactHooks.renderHook)(() => (0, _2.useThing)('EWhateverEntity', () => Promise.resolve('NEVER')), {
      wrapper: _mocks.reduxContextProvider
    }, {
      options: {
        helloWorld: true
      }
    });
    expect(result.current.data).toBe('hello world');
  });
  test('dependend queries', async () => {
    const {
      result,
      waitForValueToChange
    } = (0, _reactHooks.renderHook)(() => (0, _2.useThing)('EDependendEntity1', () => Promise.resolve('Cool, isn\'t it? 🙂')), {
      wrapper: _mocks.reduxContextProvider
    });
    await waitForValueToChange(() => result.current.isLoading);
    const {
      result: result2
    } = (0, _reactHooks.renderHook)(() => (0, _2.useThing)('EDependendEntity2', options => Promise.resolve(`This text is passed through options from dependent entity "${options}"`), {
      skip: result.current.isLoading || result.current.isInitial,
      options: result.current.data
    }), {
      wrapper: _mocks.reduxContextProvider
    });
    await waitForValueToChange(() => result2.current.isLoading);
    expect(result2.current.data).toBe('This text is passed through options from dependent entity "Cool, isn\'t it? 🙂"');
  });
  test('initialData feature', async () => {
    const {
      result,
      waitForValueToChange
    } = (0, _reactHooks.renderHook)(() => (0, _2.useThing)('EInitialDataEntity', () => Promise.resolve('Not initial anymore 🙃'), {
      initialData: _ref => {
        let {
          length = 5
        } = _ref;
        return Array.from({
          length
        }).map(() => 'A');
      },
      options: {
        length: 2
      }
    }), {
      wrapper: _mocks.reduxContextProvider
    });
    expect(result.current.data).toEqual(['A', 'A']);
    await waitForValueToChange(() => result.current.isLoading);
  });
  test('dataMapper feature', async () => {
    const {
      result,
      waitForValueToChange
    } = (0, _reactHooks.renderHook)(() => (0, _2.useThing)('EDataMapper', () => Promise.resolve([2, 4, 8]), {
      initialData: [],
      dataMapper: data => data.map(el => el * 2)
    }), {
      wrapper: _mocks.reduxContextProvider
    });
    await waitForValueToChange(() => result.current.isLoading);
    expect(result.current.mappedData).toEqual([4, 8, 16]);
  });
  test('prevent multi fetching', async () => {
    let counter = 0;
    const {
      result,
      waitForValueToChange
    } = (0, _reactHooks.renderHook)(() => (0, _2.useThing)('EMultiFetchingEntity', () => {
      counter += 1;
      return Promise.resolve(counter);
    }, {
      options: {
        multiFetching: true
      }
    }), {
      wrapper: _mocks.reduxContextProvider
    });
    const {
      result: result2
    } = (0, _reactHooks.renderHook)(() => (0, _2.useThing)('EMultiFetchingEntity', () => {
      counter += 1;
      return Promise.resolve(counter);
    }, {
      options: {
        multiFetching: true
      }
    }), {
      wrapper: _mocks.reduxContextProvider
    });
    const {
      result: result3
    } = (0, _reactHooks.renderHook)(() => (0, _2.useThing)('EMultiFetchingEntity', () => {
      counter += 1;
      return Promise.resolve(counter);
    }, {
      options: {
        multiFetching: true
      }
    }), {
      wrapper: _mocks.reduxContextProvider
    });
    await waitForValueToChange(() => result.current.isLoading);
    expect(result.current.data).toEqual(1);
    expect(result2.current.data).toEqual(1);
    expect(result3.current.data).toEqual(1);
  });
  test('fetchMore feature', async () => {
    const MAX_ITEMS = 10;

    const reducer = key => (state, _ref2) => {
      let {
        type,
        payload: data
      } = _ref2;

      if (type === `${_2.useThing.NAMESPACE}/${key}/fulfilled`) {
        return _objectSpread(_objectSpread({}, state), {}, {
          data: [...((state === null || state === void 0 ? void 0 : state.data) || []), ...(data || [])]
        });
      }

      return state || {};
    };

    const {
      result,
      waitForValueToChange
    } = (0, _reactHooks.renderHook)(() => (0, _2.useThing)('EFetchMoreEntity', _ref3 => {
      let {
        limit,
        offset
      } = _ref3;
      return Promise.resolve(Array.from({
        length: 10
      }).map((_, index) => index).slice(offset, limit + offset));
    }, {
      initialData: [],
      getFetchMore: (current, all, _ref4) => {
        let {
          limit,
          offset
        } = _ref4;

        if (limit + offset < MAX_ITEMS) {
          return {
            limit,
            offset: offset + limit
          };
        }

        return false;
      },
      reducer,
      options: {
        limit: 5,
        offset: 0
      }
    }), {
      wrapper: _mocks.reduxContextProvider
    });
    await waitForValueToChange(() => result.current.isLoading);
    (0, _reactHooks.act)(() => {
      result.current.fetchMore();
    });
    await waitForValueToChange(() => result.current.isLoading);
    expect(result.current.data.length).toBe(10);
    (0, _reactHooks.act)(() => {
      result.current.fetchMore();
    });
    expect(result.current.data.length).toBe(10);
  });
  test('reFetch feature', async () => {
    const {
      result,
      waitForValueToChange
    } = (0, _reactHooks.renderHook)(() => (0, _2.useThing)('ERefetchEntity', () => Promise.resolve('hello world')), {
      wrapper: _mocks.reduxContextProvider
    }, {
      options: {
        helloWorld: true
      }
    });
    await waitForValueToChange(() => result.current.isLoading);
    (0, _reactHooks.act)(() => {
      result.current.reFetch();
    });
    await waitForValueToChange(() => result.current.isLoading);
    expect(result.all).toMatchSnapshot();
  });
});