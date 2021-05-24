import { LauncFlowTypes } from './enums'

export default ({
    getFetchMore = false,
    selectedData = null,
    options,
    toType,
    mountedRef,
    dispatch,
    setState,
    onSuccess,
    key,
    hash
}) => ({
    onSuccess: payload => {
        const action = {
            type: toType(LauncFlowTypes.Fulfilled),
            payload,
            options,
            hash,
            key
        }
        if (getFetchMore) {
            const generatedFMOptions = getFetchMore(
                payload,
                selectedData,
                options,
                hash
            )
            action.fetchMoreOptions = generatedFMOptions
            action.canFetchMore = !!generatedFMOptions
        }
        dispatch(action)
        if (mountedRef.current) {
            setState(state => ({
                ...state,
                error: null,
                isLoading: false,
                isRefetching: false,
                onSuccessData: payload,
                cache: 'cache-first'
            }))
        }
        onSuccess(action)
        return payload
    }
})
