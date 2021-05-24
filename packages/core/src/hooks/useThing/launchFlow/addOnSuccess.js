import { Types } from '../utils'

export default ({
    getFetchMore,
    selectedData,
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
        const generatedFMOptions = getFetchMore(
            payload,
            selectedData,
            options,
            hash
        )
        const action = {
            type: toType(Types.Fulfilled),
            payload,
            fetchMoreOptions: generatedFMOptions,
            canFetchMore: !!generatedFMOptions,
            options,
            hash,
            key
        }
        dispatch(action)
        if (mountedRef.current) {
            setState(state => ({
                ...state,
                error: null,
                isLoading: false,
                isRefetching: false,
                cache: 'cache-first'
            }))
        }
        onSuccess(action)
        return payload
    }
})
