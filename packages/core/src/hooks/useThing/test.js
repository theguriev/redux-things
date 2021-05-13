import { renderHook, act } from '@testing-library/react-hooks'
import { reduxContextProvider as wrapper } from '@/mocks'
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
                options => Promise.resolve(`This text is passed through options from dependent entity "${options}"`),
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
        const reducer = key => (state, { type, payload: data }) => {
            if (type === `${useThing.NAMESPACE}/${key}/fulfilled`) {
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
                'EFetchMoreEntity',
                ({ limit, offset }) => Promise.resolve(
                    Array
                        .from({ length: 10 })
                        .map((_, index) => index)
                        .slice(offset, limit + offset)
                ),
                {
                    initialData: [],
                    getFetchMore: (current, all, { limit, offset }) => {
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

    test('reFetch feature', async () => {
        const { result, waitForValueToChange } = renderHook(
            () => useThing(
                'ERefetchEntity',
                () => Promise.resolve('hello world')
            ),
            { wrapper },
            {
                options: { helloWorld: true }
            }
        )
        await waitForValueToChange(() => result.current.isLoading)
        act(() => {
            result.current.reFetch()
        })
        await waitForValueToChange(() => result.current.isLoading)
        expect(result.all).toMatchSnapshot()
    })
})