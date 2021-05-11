/* eslint-disable prefer-promise-reject-errors */
import {
    promiseCache, preFethPromise, cache, preFetchCache
} from '.'

const options = { abc: 123 }
const resolvedData = 'resolved data'
const prefetchedData = 'prefetched data'

describe('Promise cache', () => {
    beforeEach(() => {
        cache.clear()
        preFetchCache.clear()
    })

    test('cached promsie', async () => {
        const result = []
        const all = await Promise.all([
            promiseCache({
                options,
                promiseFn: () => Promise.resolve(resolvedData),
                onStart: () => {
                    result.push('onStart')
                },
                onSuccess: res => {
                    result.push('onSuccess')
                    return res
                }
            }),
            promiseCache({
                options: {
                    abc: 123
                },
                promiseFn: () => Promise.resolve(resolvedData),
                onStart: () => {
                    result.push('onStart')
                },
                onSuccess: () => {
                    result.push('onSuccess')
                }
            })
        ])
        expect(all).toEqual([resolvedData, resolvedData])
        expect(result).toEqual(['onStart', 'onSuccess'])
    })

    test('onError', async () => {
        const errorMessage = 'Wrong but it is ok 👌🏻'
        const result = []
        await promiseCache({
            options,
            promiseFn: () => Promise.reject(errorMessage),
            onStart: () => {
                result.push('onStart')
            },
            onSuccess: res => {
                result.push('onSuccess')
                return res
            },
            onError: res => {
                result.push(['onError', res])
                return res
            }
        })
        expect(result).toEqual(['onStart', ['onError', errorMessage]])
    })

    test('prefetch', async () => {
        let fetchingCount = 0
        const result = []
        const prefetchedResult = await preFethPromise({
            options,
            promiseFn: () => {
                fetchingCount += 1
                result.push('prefetch')
                return Promise.resolve(prefetchedData)
            }
        })
        expect(prefetchedResult).toBe(prefetchedData)
        expect(promiseCache.preFetchCache.size).toBe(1)
        const promiseResult = await promiseCache({
            options,
            promiseFn: () => {
                fetchingCount += 1
                return Promise.reject('NEVER')
            },
            onStart: () => {
                result.push('onStart')
            },
            onSuccess: res => {
                result.push('onSuccess')
                return res
            },
            onError: res => {
                result.push(['onError', res])
                return res
            }
        })
        expect(result).toEqual(['prefetch', 'onStart', 'onSuccess'])
        expect(fetchingCount).toEqual(1)
        expect(promiseResult).toBe(prefetchedData)
    })
})
