import { useState, useCallback, useMemo } from 'react'
import { useStore } from 'react-redux'
import { partial } from 'lodash-es'
import {
    promiseCache,
    launchFlow,
    createLaunchFlowActions
} from '@/common'
import { implode } from '@redux-things/dumb'
import { useMounted } from '../useMounted'
import { useMutationContext } from '../useMutationContext'

export const useMutation = (
    fetchFn,
    hookOptions = {}
) => {
    const {
        mutationKey,
        onStart,
        onSuccess,
        onError,
        objectToHashFn,
        namespace,
        delimiter,
        ...extra
    } = useMutationContext(hookOptions)
    const [
        { isLoading, error, onSuccessData },
        setState
    ] = useState({ error: null, isLoading: false, onSuccessData: null })
    const toType = useCallback(
        partial(implode, delimiter, namespace, mutationKey),
        [delimiter, namespace, mutationKey]
    )
    const actions = useMemo(() => createLaunchFlowActions(toType), [toType])
    const mountedRef = useMounted()
    const { dispatch, getState } = useStore()

    const mutate = useCallback(
        launchOptions => promiseCache(
            launchFlow({
                actions,
                fetchFn,
                setState,
                dispatch,
                getState,
                extra,
                objectToHashFn,
                launchOptions,
                key: mutationKey,
                mountedRef,
                onStart,
                onSuccess,
                onError
            })
        ),
        [
            actions,
            fetchFn,
            mountedRef,
            setState,
            dispatch,
            getState,
            extra,
            objectToHashFn,
            mutationKey,
            onStart,
            onSuccess,
            onError
        ]
    )

    return {
        isLoading,
        actions,
        isError: !!error,
        error,
        data: onSuccessData,
        mutate,
        toType
    }
}
