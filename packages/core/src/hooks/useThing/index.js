import {
    useEffect,
    useState,
    useCallback
} from 'react'
import { partialRight } from 'lodash-es'
import { useSelector, useStore } from 'react-redux'
import { useInterval } from 'react-use'
import {
    toFunction,
    flow,
    promiseCache,
    preFethPromise
} from '@/utils'
import { NAMESPACE } from '@/constants'
import { entityReducer } from './utils'
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
        skip,
        cache,
        options: externalOptions,
        reFetchOnWindowFocus,
        refetchInterval,
        refetchIntervalInBackground,
        ...extra
    } = useThingsContext(hookOptions)
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
    const internalReducer = useCallback(
        flow(partialRight(entityReducer, key), partialRight(reducer, key)),
        [reducer, key]
    )
    const launch = useCallback(
        launchOptions => promiseCache({
            options: typeof options === 'object' ? { ...launchOptions, __ENTITY_KEY__: key } : options,
            promiseFn: fetchOptions => fetchFn({
                options: fetchOptions,
                dispatch,
                getState,
                extra
            }),
            onStart: () => {
                dispatch({
                    type: `${NAMESPACE}/${key}/pending`,
                    key
                })
                setState(state => ({
                    ...state,
                    isLoading: true,
                    isRefetching: !!launchOptions?.isRefetch
                }))
                onStart({
                    type: `${NAMESPACE}/${key}/pending`,
                    key
                })
            },
            onSuccess: payload => {
                const generatedFMOptions = getFetchMore(payload, selectedData, launchOptions)
                dispatch({
                    type: `${NAMESPACE}/${key}/fulfilled`,
                    payload,
                    fetchMoreOptions: generatedFMOptions,
                    canFetchMore: !!generatedFMOptions,
                    options: launchOptions,
                    key
                })
                onSuccess({
                    type: `${NAMESPACE}/${key}/fulfilled`,
                    payload,
                    fetchMoreOptions: generatedFMOptions,
                    canFetchMore: !!generatedFMOptions,
                    options: launchOptions,
                    key
                })
                return payload
            },
            onError: payload => {
                dispatch({
                    type: `${NAMESPACE}/${key}/error`,
                    payload,
                    key
                })
                onError({
                    type: `${NAMESPACE}/${key}/error`,
                    payload,
                    key
                })
                return payload
            }
        })
            .then(
                payload => {
                    if (mountedRef.current) {
                        setState(state => ({
                            ...state,
                            error: null,
                            isLoading: false,
                            isRefetching: false,
                            cache: 'cache-first'
                        }))
                    }
                    return payload
                }
            )
            .catch(catchedError => {
                if (!catchedError) {
                    if (mountedRef.current) {
                        setState(state => ({
                            ...state,
                            error: catchedError,
                            isLoading: false,
                            isRefetching: false,
                            cache: 'cache-first'
                        }))
                    }
                    return catchedError
                }
            }),
        [fetchFn, getFetchMore, selectedData, setState]
    )

    const reFetch = useCallback(() => launch({ ...options, isRefetch: true }), [options])
    const preFetch = useCallback((extendOptions = {}) => preFethPromise({
        options: typeof options === 'object' ? { ...options, __ENTITY_KEY__: key, ...extendOptions } : options,
        promiseFn: fetchFn
    }), [options])

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
    }, [skip, error, isLoading, data])

    const raw = data || initialDataFn(options)
    const mappedData = dataMapper(raw, { isLoading, isRefetching, isInitial })
    const refetchIntervalFn = useCallback(
        () => {
            if (hasFocus || refetchIntervalInBackground) {
                reFetch()
            }
        },
        [hasFocus, refetchIntervalInBackground]
    )

    useInterval(refetchIntervalFn, refetchInterval)

    useInjectReducer(key, internalReducer)

    useEffect(() => {
        if (reFetchOnWindowFocus && hasFocus && !isFirstTime) {
            reFetch()
        }
    }, [hasFocus, reFetchOnWindowFocus, isFirstTime])

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

useThing.NAMESPACE = NAMESPACE
