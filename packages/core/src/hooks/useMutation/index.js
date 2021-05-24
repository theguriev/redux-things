import { useState, useCallback } from 'react'
import { useStore } from 'react-redux'
import { partial } from 'lodash-es'
import { promiseCache, launchFlow } from '@/common'
import { restImplode } from '@/utils'
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
    const toType = partial(restImplode, delimiter, namespace, mutationKey)
    const mountedRef = useMounted()
    const { dispatch, getState } = useStore()

    const mutate = useCallback(
        launchOptions => promiseCache(
            launchFlow({
                fetchFn,
                setState,
                dispatch,
                getState,
                extra,
                objectToHashFn,
                launchOptions,
                toType,
                key: mutationKey,
                mountedRef,
                onStart,
                onSuccess,
                onError
            })
        ),
        [
            fetchFn,
            mountedRef,
            setState,
            dispatch,
            getState,
            extra,
            objectToHashFn,
            toType,
            mutationKey,
            onStart,
            onSuccess,
            onError
        ]
    )

    return {
        isLoading,
        isError: !!error,
        error,
        data: onSuccessData,
        mutate,
        toType
    }
}
