import { jest } from '@jest/globals'
import { renderHook, act } from '@testing-library/react-hooks'
import { reduxContextProvider as wrapper } from '@redux-things/mocks'
import { useThing } from '.'

describe('useThing', () => {
    test('basic scenario', async () => {
        const { result, waitForValueToChange } = renderHook(
            () => useThing(
                'EWhateverEntity',
                () => Promise.resolve('hello world')
            ),
            { wrapper },
            {
                options: { helloWorld: true }
            }
        )
        await waitForValueToChange(() => result.current.isLoading)
        expect(result.all).toMatchSnapshot()
    })

    test('getting from the cache', async () => {
        const { result } = renderHook(
            () => useThing(
                'EWhateverEntity',
                () => Promise.resolve('NEVER')
            ),
            { wrapper },
            {
                options: { helloWorld: true }
            }
        )
        expect(result.current.data).toBe('hello world')
    })

    test('dependend queries', async () => {
        const { result, waitForValueToChange } = renderHook(
            () => useThing(
                'EDependendEntity1',
                () => Promise.resolve('Cool, isn\'t it? 🙂')
            ),
            { wrapper }
        )
        await waitForValueToChange(() => result.current.isLoading)
        const { result: result2 } = renderHook(
            () => useThing(
                'EDependendEntity2',
                ({ options }) => Promise.resolve(`This text is passed through options from dependent entity "${options}"`),
                {
                    skip: result.current.isLoading || result.current.isInitial,
                    options: result.current.data
                }
            ),
            { wrapper }
        )
        await waitForValueToChange(() => result2.current.isLoading)
        expect(result2.current.data).toBe('This text is passed through options from dependent entity "Cool, isn\'t it? 🙂"')
    })

    test('initialData feature', async () => {
        const { result, waitForValueToChange } = renderHook(
            () => useThing(
                'EInitialDataEntity',
                () => Promise.resolve('Not initial anymore 🙃'),
                {
                    initialData: ({ length = 5 }) => Array.from({ length }).map(() => 'A'),
                    options: {
                        length: 2
                    }
                }
            ),
            { wrapper }
        )
        expect(result.current.data).toEqual(['A', 'A'])
        await waitForValueToChange(() => result.current.isLoading)
    })

    test('dataMapper feature', async () => {
        const { result, waitForValueToChange } = renderHook(
            () => useThing(
                'EDataMapper',
                () => Promise.resolve([2, 4, 8]),
                {
                    initialData: [],
                    dataMapper: data => data.map(el => el * 2)
                }
            ),
            { wrapper }
        )
        await waitForValueToChange(() => result.current.isLoading)
        expect(result.current.mappedData).toEqual([4, 8, 16])
    })

    test('prevent multi fetching', async () => {
        let counter = 0
        const { result, waitForValueToChange } = renderHook(
            () => useThing(
                'EMultiFetchingEntity',
                () => {
                    counter += 1
                    return Promise.resolve(counter)
                },
                {
                    options: { multiFetching: true }
                }
            ),
            { wrapper }
        )
        const { result: result2 } = renderHook(
            () => useThing(
                'EMultiFetchingEntity',
                () => {
                    counter += 1
                    return Promise.resolve(counter)
                },
                {
                    options: { multiFetching: true }
                }
            ),
            { wrapper }
        )
        const { result: result3 } = renderHook(
            () => useThing(
                'EMultiFetchingEntity',
                () => {
                    counter += 1
                    return Promise.resolve(counter)
                },
                {
                    options: { multiFetching: true }
                }
            ),
            { wrapper }
        )
        await waitForValueToChange(() => result.current.isLoading)

        expect(result.current.data).toEqual(1)
        expect(result2.current.data).toEqual(1)
        expect(result3.current.data).toEqual(1)
    })

    test('fetchMore feature', async () => {
        const MAX_ITEMS = 10
        const reducer = (state, { type, payload: data }, { toType }) => {
            if (type === toType(useThing.Types.Fulfilled)) {
                return {
                    ...state,
                    data: [
                        ...(state?.data || []),
                        ...(data || [])
                    ]
                }
            }
            return state || {}
        }
        const { result, waitForValueToChange } = renderHook(
            () => useThing(
                'TFetchMoreEntity',
                ({ options: { limit, offset } }) => Promise.resolve(
                    Array
                        .from({ length: 10 })
                        .map((_, index) => index)
                        .slice(offset, limit + offset)
                ),
                {
                    initialData: [],
                    getFetchMore: ({ options: { limit, offset } }) => {
                        if (limit + offset < MAX_ITEMS) {
                            return { limit, offset: offset + limit }
                        }
                        return false
                    },
                    reducer,
                    options: {
                        limit: 5,
                        offset: 0
                    }
                }
            ),
            { wrapper }
        )
        await waitForValueToChange(() => result.current.isLoading)
        act(() => {
            result.current.fetchMore()
        })
        await waitForValueToChange(() => result.current.isLoading)
        expect(result.current.data.length).toBe(10)
        act(() => {
            result.current.fetchMore()
        })
        expect(result.current.data.length).toBe(10)
    })

    test('refetch feature', async () => {
        const { result, waitForValueToChange } = renderHook(
            () => useThing(
                'TRefetchEntity',
                () => Promise.resolve('hello world')
            ),
            { wrapper },
            {
                options: { helloWorld: true }
            }
        )
        await waitForValueToChange(() => result.current.isLoading)
        act(() => {
            result.current.refetch()
        })
        await waitForValueToChange(() => result.current.isLoading)
        expect(result.all).toMatchSnapshot()
    })

    test('debounce options changing', async () => {
        jest.useFakeTimers('modern')
        const debounceInterval = 1000
        const callback = jest.fn().mockImplementation(({ options }) => Promise.resolve(options))
        const { result, rerender, waitForValueToChange } = renderHook(
            props => useThing(
                'TDebounce',
                callback,
                {
                    ...props,
                    reducer: (state, { type, payload: data }, { toType }) => {
                        if (type === toType('fulfilled')) {
                            return {
                                ...state,
                                data: {
                                    ...state.data,
                                    [data.count]: data
                                }
                            }
                        }
                        return state || {}
                    },
                    selector: (state, { key, options }) => (
                        state?.[key]?.data?.[options.count] || null
                    )
                }
            ),
            {
                wrapper,
                initialProps: {
                    debounceInterval,
                    options: {
                        count: 1
                    }
                }
            }
        )
        await waitForValueToChange(() => result.current.isLoading)
        expect(result.current.data.count).toBe(1)
        expect(callback).toHaveBeenCalledTimes(1)
        rerender({
            debounceInterval,
            options: {
                count: 2
            }
        })
        rerender({
            debounceInterval,
            options: {
                count: 3
            }
        })
        rerender({
            debounceInterval,
            options: {
                count: 4
            }
        })
        act(() => jest.runAllTimers())
        await waitForValueToChange(() => result.current.isLoading)
        expect(callback).toHaveBeenCalledTimes(2)
        expect(result.current.data.count).toBe(4)
        jest.useRealTimers()
    })

    test('object reducer', async () => {
        const { result, waitForValueToChange } = renderHook(
            () => useThing(
                'TObjectReducer',
                () => Promise.resolve('hello world'),
                {
                    reducer: {
                        dictionary: {
                            fulfilled: (state, { payload }) => ({
                                ...state,
                                data: {
                                    hello: payload
                                }
                            })
                        }
                    }
                }
            ),
            { wrapper },
            {
                options: { helloWorld: true }
            }
        )
        await waitForValueToChange(() => result.current.isLoading)
        expect(result.current.data.hello).toBe('hello world')
    })

    test('extend actions in return', async () => {
        const { result, waitForValueToChange } = renderHook(
            () => useThing(
                'TActions',
                () => Promise.resolve('hello world'),
                {
                    reducer: {
                        dictionary: {
                            fulfilled: (state, { payload }) => ({
                                ...state,
                                data: {
                                    hello: payload
                                }
                            }),
                            additionalAction: state => ({
                                ...state,
                                data: {
                                    hello: 'additional action'
                                }
                            })
                        }
                    }
                }
            ),
            { wrapper },
            {
                options: { helloWorld: true }
            }
        )
        await waitForValueToChange(() => result.current.isLoading)
        expect(result.current.actions.pending).toBeInstanceOf(Function)
        expect(result.current.actions.fulfilled).toBeInstanceOf(Function)
        expect(result.current.actions.error).toBeInstanceOf(Function)
        expect(result.current.actions.additionalAction).toBeInstanceOf(Function)
    })
})
