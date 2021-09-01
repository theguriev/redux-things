import { flow } from '@redux-things/dumb'

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
    hash,
    promiseFn,
    onStart = () => {},
    onSuccess = () => {},
    onError = () => {}
}) => {
    if (cache.has(hash)) {
        return cache.get(hash)
    }
    onStart()
    const promise = preFetchOrFetch(hash, promiseFn)
    cache.set(hash, promise)
    return promise
        .then(flow(onSuccess, removePromiseFromCache(hash)))
        .catch(flow(onError, removePromiseFromCache(hash)))
}

/**
 * Put promise into preFetch cache.
 */
export const preFethPromise = ({
    hash,
    promiseFn
}) => {
    if (preFetchCache.has(hash)) {
        return preFetchCache.get(hash)
    }
    const promise = promiseFn()
    preFetchCache.set(hash, promise)
    return promise
}

export const preFetchThing = (key, promiseFn, options = {}) => preFethPromise(
    {
        options: {
            ...options,
            __ENTITY_KEY__: key
        },
        promiseFn
    }
)

promiseCache.cache = cache
promiseCache.preFetchCache = preFetchCache
