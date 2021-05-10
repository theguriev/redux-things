import { omit } from 'lodash-es'
import objectHash from 'object-hash'
import { flow } from '@/utils'
import { ENTITIES_NAMESPACE } from '@/constants'

export const defaultReducer = key => (state, { type, payload: data }) => {
    if (type === `${ENTITIES_NAMESPACE}/${key}/fulfilled`) {
        return {
            ...state,
            data
        }
    }
    return state || {}
}

export const defaultSelector = (state, _options, key) => state?.[key]?.data || null

export const entityReducer = key => (
    state,
    { type, fetchMoreOptions, canFetchMore }
) => {
    const targetType = `${ENTITIES_NAMESPACE}/${key}/fulfilled`
    const removeFetchMoreOptionsType = `${ENTITIES_NAMESPACE}/${key}/removeFetchMoreOptions`
    if (type === targetType) {
        return {
            ...state,
            fetchMoreOptions,
            canFetchMore
        }
    }
    if (type === removeFetchMoreOptionsType) {
        return omit(state, ['fetchMoreOptions', 'canFetchMore'])
    }
    return state || {}
}

const removePromiseFromCache = hash => result => {
    cachedPromise.cache.delete(hash)
    return result
}

export const cachedPromise = ({
    options,
    promiseFn,
    onStart = () => {},
    onSuccess = () => {},
    onError = () => {}
}) => {
    const hash = objectHash(options, { unorderedObjects: true })
    if (cachedPromise.cache.has(hash)) {
        return cachedPromise.cache.get(hash)
    }
    onStart()
    const promise = promiseFn(options)
    cachedPromise.cache.set(hash, promise)
    return promise
        .then(flow(onSuccess, removePromiseFromCache(hash)))
        .catch(onError)
}

cachedPromise.cache = new Map()
