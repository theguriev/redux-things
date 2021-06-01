export default ({
    getFetchMore = false,
    selectedData = null,
    options,
    actions: {
        fulfilled
    },
    mountedRef,
    dispatch,
    setState,
    onSuccess,
    key,
    hash
}) => ({
    onSuccess: payload => {
        const action = fulfilled({
            payload,
            options,
            hash,
            key
        })
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
