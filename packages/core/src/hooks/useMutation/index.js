import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { promiseCache } from '@/utils'
import { NAMESPACE } from '@/constants'
import { useMounted } from '../useMounted'
import { useMutationContext } from '../useMutationContext'

export const useMutation = (
    promiseFn,
    hookOptions = {}
) => {
    const {
        mutationKey,
        onStart,
        onSuccess,
        onError
    } = useMutationContext(hookOptions)
    const [
        { isLoading, error, data },
        setState
    ] = useState({ error: null, isLoading: false, data: null })

    const mountedRef = useMounted()
    const dispatch = useDispatch()

    const mutate = useCallback(
        (launchOptions = {}) => promiseCache({
            options: { ...launchOptions, __ENTITY_KEY__: mutationKey },
            promiseFn,
            onStart: () => {
                dispatch({
                    type: `${NAMESPACE}/mutate/${mutationKey}/pending`,
                    key: mutationKey
                })
                setState(state => ({
                    ...state,
                    isLoading: true
                }))
                onStart({
                    type: `${NAMESPACE}/mutate/${mutationKey}/pending`,
                    key: mutationKey
                })
            },
            onSuccess: payload => {
                dispatch({
                    type: `${NAMESPACE}/mutate/${mutationKey}/fulfilled`,
                    payload,
                    key: mutationKey
                })
                onSuccess({
                    type: `${NAMESPACE}/mutate/${mutationKey}/fulfilled`,
                    payload,
                    key: mutationKey
                })
                return payload
            },
            onError: payload => {
                dispatch({
                    type: `${NAMESPACE}/mutate/${mutationKey}/error`,
                    payload,
                    key: mutationKey
                })
                onError({
                    type: `${NAMESPACE}/mutate/${mutationKey}/error`,
                    payload,
                    key: mutationKey
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
                            data: payload,
                            isLoading: false
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
                            isLoading: false
                        }))
                    }
                    return catchedError
                }
            }),
        [promiseFn, mutationKey, setState]
    )

    return {
        isLoading,
        isError: !!error,
        error,
        data,
        mutate
    }
}
