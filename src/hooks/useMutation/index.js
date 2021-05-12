import { useState, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { createAsyncThunkWithError, promiseCache } from '@/utils'
import { ENTITIES_NAMESPACE } from '@/constants'

export const useMutation = (
    promiseFn,
    {
        mutationKey = 'global'
    } = {}
) => {
    const [
        { isLoading, error, data },
        setState
    ] = useState({ error: null, isLoading: false, data: null })
    const dispatch = useDispatch()

    const launch = useCallback(
        (launchOptions = {}) => promiseCache({
            options: { ...launchOptions, __ENTITY_KEY__: mutationKey },
            promiseFn,
            onStart: () => {
                dispatch({
                    type: `${ENTITIES_NAMESPACE}/mutate/${mutationKey}/pending`,
                    key: mutationKey
                })
                setState(state => ({
                    ...state,
                    isLoading: true,
                    isRefetching: !!launchOptions?.isRefetch
                }))
            },
            onSuccess: payload => {
                dispatch({
                    type: `${ENTITIES_NAMESPACE}/mutate/${mutationKey}/fulfilled`,
                    payload,
                    fetchMoreOptions: generatedFMOptions,
                    canFetchMore: !!generatedFMOptions,
                    key
                })
                return payload
            },
            onError: payload => {
                dispatch({
                    type: `${ENTITIES_NAMESPACE}/${key}/error`,
                    payload,
                    key
                })
                return payload
            }
        })
            .then(
                payload => {
                    if (!isUnmounted.current) {
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
                    if (!isUnmounted.current) {
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

    const action = useMemo(
        () => createAsyncThunkWithError(
            `${mutationKey}`,
            (options, extra) => mutationFn({ options, ...extra })
                .then(
                    res => ({
                        data: res,
                        options
                    })
                )
        ),
        [mutationFn, mutationKey]
    )

    const mutate = useCallback(options => {
        setState(state => ({ ...state, isLoading: true }))
        return dispatch(action(options))
            .then(
                res => {
                    setState(state => ({ ...state, isLoading: false, data: res }))
                    return res
                }
            )
            .catch(
                catchedError => {
                    setState(state => ({ ...state, error: catchedError }))
                    return error
                }
            )
    }, [action])

    return {
        isLoading,
        error,
        data,
        mutate
    }
}
