import {
    useEffect,
    useState,
    useCallback
} from 'react'
import { partialRight, partial } from 'lodash-es'
import { useSelector, useStore } from 'react-redux'
import { useInterval } from 'react-use'
import {
    toFunction,
    flow,
    restImplode
} from '@/utils'
import {
    promiseCache,
    preFethPromise,
    launchFlow,
    LauncFlowTypes
} from '@/common'
import {
    thingReducer
} from './utils'
import { useInjectReducer } from '../useInjectReducer'
import { useMounted } from '../useMounted'
import { useWindowFocus } from '../useWindowFocus'
import { useThingsContext } from '../useThingsContext'

export const useThing = (
    key,
    fetchFn,
    hookOptions = {}
) => {
    const {
        reducer,
        selector,
        initialData,
        getFetchMore,
        dataMapper,
        onStart,
        onSuccess,
        onError,
        objectToHashFn,
        skip,
        cache,
        options: externalOptions,
        reFetchOnWindowFocus,
        reFetchInterval,
        reFetchIntervalInBackground,
        namespace,
        delimiter,
        ...extra
    } = useThingsContext(hookOptions)

    const toType = partial(restImplode, delimiter, namespace, key)
    const { hasFocus, isFirstTime } = useWindowFocus(!reFetchOnWindowFocus)
    const canFetchMore = useSelector(state => !!state?.[key]?.canFetchMore)
    const fetchMoreOptions = useSelector(state => state?.[key]?.fetchMoreOptions)
    const [{
        error,
        isLoading,
        isRefetching,
        cache: _cache,
        options
    }, setState] = useState({
        isRefetching: false,
        isLoading: cache === 'no-cache',
        error: null,
        requestPromise: null,
        cache,
        options: fetchMoreOptions || externalOptions
    })
    const { dispatch, getState } = useStore()
    const initialDataFn = toFunction(initialData)
    const selectedData = useSelector(state => selector(state, options, key))
    const data = _cache === 'no-cache' ? null : selectedData
    const isInitial = data === null
    const mountedRef = useMounted()
    const internalReducer = flow(
        partialRight(thingReducer, { toType }),
        partialRight(reducer, { toType })
    )
    const launch = useCallback(
        launchOptions => promiseCache(
            launchFlow({
                fetchFn,
                getFetchMore,
                selectedData,
                setState,
                dispatch,
                getState,
                extra,
                objectToHashFn,
                launchOptions,
                toType,
                key,
                mountedRef,
                onStart,
                onSuccess,
                onError
            })
        ),
        [
            fetchFn,
            mountedRef,
            getFetchMore,
            selectedData,
            setState,
            dispatch,
            getState,
            extra,
            objectToHashFn,
            toType,
            key,
            onStart,
            onSuccess,
            onError
        ]
    )

    const reFetch = useCallback(() => launch({ ...options, isRefetch: true }), [options, launch])
    const preFetch = useCallback((extendOptions = {}) => {
        const cacheOptions = typeof options === 'object' ? { ...options, __THING_KEY__: key, ...extendOptions } : options
        const hash = objectToHashFn(cacheOptions)
        return preFethPromise({
            hash,
            promiseFn: () => fetchFn({
                options: cacheOptions,
                dispatch,
                getState,
                extra
            })
        })
    }, [options, fetchFn, dispatch, getState, extra, objectToHashFn, key])

    const fetchMore = useCallback(
        newOptions => {
            if (canFetchMore === false) {
                return Promise.resolve()
            }
            return launch(newOptions || fetchMoreOptions)
        },
        [fetchMoreOptions, canFetchMore, launch]
    )

    // If hook props change we need to update internal options state as
    // internal state might be different with prev props due to change by fetch more action
    useEffect(() => {
        if (externalOptions) {
            setState(state => ({
                ...state,
                options: externalOptions
            }))
        }
    }, [JSON.stringify(externalOptions)])

    useEffect(() => {
        if (!error && !skip && (!isLoading || _cache === 'no-cache') && !data) {
            launch(options)
        }
    }, [skip, error, isLoading, options, _cache, launch])

    const raw = data || initialDataFn(options)
    const mappedData = dataMapper(raw, { isLoading, isRefetching, isInitial })
    const reFetchIntervalFn = () => {
        if (hasFocus || reFetchIntervalInBackground) {
            reFetch()
        }
    }

    useInterval(reFetchIntervalFn, reFetchInterval)

    useInjectReducer(key, internalReducer)

    useEffect(() => {
        if (reFetchOnWindowFocus && hasFocus && !isFirstTime) {
            reFetch()
        }
    }, [hasFocus, reFetchOnWindowFocus, isFirstTime, reFetch])

    return {
        error,
        isError: !!error,
        isLoading,
        isRefetching,
        isInitial,
        data: raw,
        mappedData,
        reFetch,
        fetchMore,
        preFetch,
        canFetchMore
    }
}

useThing.Types = LauncFlowTypes
