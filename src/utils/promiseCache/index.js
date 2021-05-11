import objectHash from 'object-hash'
import { flow } from '../flow'

export const cache = new Map()
export const preFetchCache = new Map()

/**
 * Get promise from preFetch cache if it's possible and run fn if not.
 */
const preFetchOrFetch = (hash, fn) => {
    if (preFetchCache.has(hash)) {
        const preFetchedPromise = preFetchCache.get(hash)
        preFetchCache.delete(hash)
        return preFetchedPromise
    }
    return fn()
}

const removePromiseFromCache = hash => result => {
    cache.delete(hash)
    return result
}

export const promiseCache = ({
    options,
    promiseFn,
    onStart = () => {},
    onSuccess = () => {},
    onError = () => {}
}) => {
    const hash = objectHash(options, { unorderedObjects: true })
    if (cache.has(hash)) {
        return cache.get(hash)
    }
    onStart()
    const promise = preFetchOrFetch(hash, () => promiseFn(options))
    cache.set(hash, promise)
    return promise
        .then(flow(onSuccess, removePromiseFromCache(hash)))
        .catch(onError)
}

/**
 * Put promise into preFetch cache.
 */
export const preFethPromise = ({
    options,
    promiseFn
}) => {
    const hash = objectHash(options, { unorderedObjects: true })
    if (preFetchCache.has(hash)) {
        return preFetchCache.get(hash)
    }
    const promise = promiseFn(options)
    preFetchCache.set(hash, promise)
    return promise
}

promiseCache.cache = cache
promiseCache.preFetchCache = preFetchCache
