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
