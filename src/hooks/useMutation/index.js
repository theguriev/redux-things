import { useState, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { createAsyncThunkWithError } from '@/utils'
import { ENTITIES_NAMESPACE } from '@/constants'

export const useMutation = (
    mutationFn,
    {
        mutationKey = `${ENTITIES_NAMESPACE}/mutate`
    } = {}
) => {
    const [
        { isLoading, error, data },
        setState
    ] = useState({ error: null, isLoading: false, data: null })
    const dispatch = useDispatch()
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
                error => {
                    setState(state => ({ ...state, error }))
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
