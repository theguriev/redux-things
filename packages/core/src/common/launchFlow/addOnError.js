import { LauncFlowTypes } from './enums'

export default ({
    toType,
    hash,
    key,
    dispatch,
    setState,
    mountedRef,
    onError
}) => ({
    onError: payload => {
        const action = {
            type: toType(LauncFlowTypes.Error),
            payload,
            hash,
            key
        }
        dispatch(action)
        if (mountedRef.current) {
            setState(state => ({
                ...state,
                error: payload,
                isLoading: false,
                isRefetching: false,
                cache: 'cache-first'
            }))
        }
        onError(action)
        return payload
    }
})
