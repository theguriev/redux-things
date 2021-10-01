import {
    useEffect,
    useMemo,
    useState,
    useCallback
} from 'react'
import {
    partialRight,
    partial,
    isEqual,
    isFunction,
    debounce
} from 'lodash-es'
import { useSelector, useStore } from 'react-redux'
import { useInterval } from 'react-use'
import { implode, toFunction, flow } from '@redux-things/dumb'
import {
    promiseCache,
    preFethPromise,
    launchFlow,
    preFetchFlow,
    selectFlow,
    LauncFlowTypes,
    createLaunchFlowActions
} from '@/common'
import {
    convertObjectToReducer,
    getActionsFromObjectReducer,
    fetchMoreWithTypeCheckingReducer
} from './utils'
import { useInjectReducer } from '../useInjectReducer'
import { useMounted } from '../useMounted'
import { useWindowFocus } from '../useWindowFocus'
import { useThingContext } from '../useThingContext'
import { useCompareEffect } from '../useCompareEffect'

/**
 * @typedef {object} ThingOptions
 * @property {Function} reducer
 *      classical or object (toolkit like) redux reducer.
 * @property {Function} selector
 *      selector to select data from the store.
 * @property {Function|unknown|null} initialData
 *      if set, this value will be used as the initial data for the thing.
 * @property {Function} getFetchMore
 *      ({ payload, selectedData, options, hash }) => boolean | object - function to generate
 *      fetch options to fetchMore function.
 *          * When new data is received for this thing, this function receives last options,
 *              last fetch result of the infinite list of data and the full array of all chunks.
 *          * Return `false` to indicate there is no next page available.
 * @property {Function} dataMapper
 *      data mapper function. It will prepare your data before showing it somewhere.
 *      Use *mappedData* as a result of dataMapper.
 *          * `skip: boolean`
 *              * Set this to **true** to disable this thing from automatically running.
 *              * Can be used for dependent entities.
 *          * `cache: string`
 *              * 'no-cache' - try to fetch on the first usage of the hook.
 *              * 'cache-first' - get data from the cache and if there is not cache fetch it.
 * @property {Record<string, unknown>} options
 *      will be passed into fetch, fetchMore, refetch function and selector as a second argument.
 *      Here should be only data which can be serialized otherwise redux will complain.
 * @property {boolean} refetchOnWindowFocus
 *      If set to true, the thing will refetch on window focus if the data is stale.
 * @property {false|number} refetchInterval
 *      If set to a number, all things will continuously refetch at this frequency in milliseconds.
 * @property {boolean} reFetchIntervalInBackground
 *      If set to true, things that are set to continuously refetch with a refetchInterval
 *      will continue to refetch while their tab/window is in the background.
 * @property {Function} onStart
 *      will be fired when fetching will be launched.
 * @property {Function} onSuccess
 *      when promise will resolved.
 * @property {Function} onError
 *      when promise will rejected.
 * @property {string} namespace
 *      global actions namespace. Default: `@redux-things`
 * @property {string} delimiter
 *      type delimiter. Using for separate type, key and namespace.
 *      Eample: @redux-things/TSomething/Fullfiled. Default: `/`
 * @property {number} debounceInterval
 *      changing options trigger debounce interval.
 * @property {...Object} extra
 *      anything you wanna pass to fetchFn. Usually, it's some API client or something like that.
 */

/**
 * @typedef {object} ThingReturn
 * @property {boolean} isError
 *      has some errors or not.
 * @property {boolean} isLoading
 *      true if the thing is currently fetching.
 * @property {boolean} isRefetching
 *      true if the thing is currently refetching.
 * @property {boolean} isInitial
 *      true if the data is in initial state.
 * @property {unknown} error
 *      the error object or string.
 * @property {null|unknown} data
 *      * Defaults to `null`.
 *      * The last successfully resolved data for the thing.
 * @property {nul|unknown} mappedData
 *      prepared ( by dataMapper option ) data.
 * @property {Function} refetch
 *      a function to manually refetch the thing.
 * @property {Function} fetchMore
 *      a function to manually fetchMore the thing with additional request options. Example:
 *      ```js
 *          fetchMore({ offset: 10, limit: 10 }).then(res => console.log)
 *          // or
 *          fetchMore()
 *      ```
 * @property {Function} preFetch
 *      a function to manually prefetch the thing.
 * @property {boolean} canFetchMore
 *      the result of getFetchMore function.
 * @property {Function} toType
 *      a function to generate type based on string.
 *      Example: toType('something') === `${namespace}/${key}/something`
 * @property {Record<string, Function>} actions
 *      * `pending: Function` - pending action creator function.
 *      * `fulfilled: Function` - fulfilled action creator function.
 *      * `error: Function` - error action creator function.
 *      * ...extraActions - all extra actions what was added with object reducer.
 */

/**
 * A thing is a declarative dependency on an asynchronous source of data that
 * is tied to a unique key. A thing can be used with any Promise based method
 * (including GET and POST methods) to fetch data from a server. If your method
 * modifies data on the server, we recommend using Mutations instead.
 *
 * @param {string} externalKey a unique key for the thing.
 * @param {*} fetchFn a function that returns a promise.
 * @param {ThingOptions} hookOptions hook options.
 * @returns {ThingReturn}
 */
export const useThing = (
    externalKey,
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
        skip: externalSkip,
        cache,
        options: externalOptions = {},
        refetchOnWindowFocus,
        refetchInterval,
        refetchIntervalInBackground,
        namespace,
        delimiter,
        debounceInterval,
        ...extra
    } = useThingContext(hookOptions)
    const [key, setKey] = useState(externalKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const toType = useCallback(
        partial(implode, delimiter, namespace, key),
        [delimiter, namespace, key]
    )
    const { hasFocus, isFirstTime } = useWindowFocus(!refetchOnWindowFocus)
    const canFetchMore = useSelector(state => !!state?.[key]?.canFetchMore)
    const fetchMoreOptions = useSelector(state => state?.[key]?.fetchMoreOptions)
    const [{
        error,
        isLoading,
        isRefetching,
        cache: _cache,
        options,
        skip
    }, setState] = useState({
        isRefetching: false,
        isLoading: cache === 'no-cache',
        error: null,
        cache,
        options: fetchMoreOptions || externalOptions,
        skip: externalSkip
    })
    const { dispatch, getState } = useStore()
    const initialDataFn = toFunction(initialData)
    const selectedData = useSelector(
        state => selector(
            state,
            selectFlow({
                launchOptions: options,
                objectToHashFn,
                key,
                toType
            })
        )
    )
    const data = _cache === 'no-cache' ? null : selectedData
    const isInitial = data === null
    const mountedRef = useMounted()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const internalReducer = useMemo(
        () => {
            if (isFunction(reducer)) {
                return flow(
                    partialRight(reducer, { toType, key }),
                    partialRight(fetchMoreWithTypeCheckingReducer, { toType, key })
                )
            }
            return partialRight(convertObjectToReducer(reducer, toType), { toType, key })
        }, [key, reducer, toType]
    )
    const actions = useMemo(
        () => ({
            ...createLaunchFlowActions(toType),
            ...getActionsFromObjectReducer(reducer, toType)
        }),
        [reducer, toType]
    )

    const launch = useCallback(
        launchOptions => promiseCache(
            launchFlow({
                actions,
                fetchFn,
                getFetchMore,
                selectedData,
                setState,
                dispatch,
                getState,
                extra,
                objectToHashFn,
                launchOptions,
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
            key,
            onStart,
            onSuccess,
            onError,
            actions
        ]
    )

    const refetch = useCallback(() => launch({ ...options, isRefetch: true }), [options, launch])
    const preFetch = useCallback((extendOptions = {}) => preFethPromise(
        preFetchFlow({
            launchOptions: { ...options, ...extendOptions },
            key,
            fetchFn,
            objectToHashFn,
            dispatch,
            getState,
            extra
        })
    ), [options, fetchFn, dispatch, getState, extra, objectToHashFn, key])

    const fetchMore = useCallback(
        newOptions => {
            if (canFetchMore === false && !newOptions) {
                return Promise.resolve()
            }
            return launch(newOptions || fetchMoreOptions)
        },
        [fetchMoreOptions, canFetchMore, launch]
    )

    // If hook props change we need to update internal options state as
    // internal state might be different with prev props due to change by fetch more action
    const setDebounceState = useMemo(
        () => {
            if (debounceInterval) {
                return debounce(newState => {
                    setState(state => ({
                        ...state, ...newState
                    }))
                }, debounceInterval)
            }
            return newState => {
                setState(state => ({
                    ...state, ...newState
                }))
            }
        },
        [debounceInterval, setState]
    )

    useCompareEffect(() => {
        if (externalOptions) {
            setDebounceState({
                options: externalOptions
            })
        }
    }, [externalOptions, setDebounceState], isEqual)

    // We should update skip in the regular react loop
    // It can't be simple static change because then
    // You'll have a prbolems with sequence of options, skip updates
    useEffect(() => {
        setDebounceState({ skip: externalSkip })
    }, [externalSkip, setDebounceState])

    useEffect(() => {
        if (!error && !skip && (!isLoading || _cache === 'no-cache') && !data) {
            launch(options)
        }
    // We can't add here data beacuse then here will be infinity loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skip, error, isLoading, options, _cache, launch])

    const raw = data || initialDataFn(options)
    const mappedData = dataMapper(
        raw,
        {
            isLoading,
            isRefetching,
            isInitial,
            options
        }
    )
    const refetchIntervalFn = () => {
        if (hasFocus || refetchIntervalInBackground) {
            refetch()
        }
    }

    useInterval(refetchIntervalFn, refetchInterval)

    useInjectReducer(key, internalReducer)

    useEffect(() => {
        if (refetchOnWindowFocus && hasFocus && !isFirstTime) {
            refetch()
        }
    }, [hasFocus, refetchOnWindowFocus, isFirstTime, refetch])

    useEffect(() => {
        setKey(externalKey)
    }, [externalKey])

    return {
        error,
        isError: !!error,
        isLoading,
        isRefetching,
        isInitial,
        data: raw,
        mappedData,
        refetch,
        fetchMore,
        preFetch,
        canFetchMore,
        toType,
        actions
    }
}

useThing.Types = LauncFlowTypes
