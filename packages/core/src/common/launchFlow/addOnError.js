export default ({
    actions: {
        error
    },
    hash,
    key,
    dispatch,
    setState,
    mountedRef,
    onError
}) => ({
    onError: payload => {
        const action = error({
            payload,
            hash,
            key
        })
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
