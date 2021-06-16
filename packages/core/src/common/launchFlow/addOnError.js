const converErrorToObject = error => ({
    stack: error.stack,
    message: error.message,
    name: error.name
})
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
    onError: errorObject => {
        const payload = (
            errorObject instanceof Error ? converErrorToObject(errorObject) : errorObject
        )
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
