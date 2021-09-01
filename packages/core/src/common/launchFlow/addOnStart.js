export default ({
    dispatch,
    actions: {
        pending
    },
    setState,
    hash,
    key,
    options,
    onStart
}) => ({
    onStart: () => {
        const action = pending({
            hash,
            key
        })
        dispatch(action)
        setState(state => ({
            ...state,
            error: null,
            isLoading: true,
            isRefetching: !!options?.isRefetch
        }))
        onStart(action)
    }
})
