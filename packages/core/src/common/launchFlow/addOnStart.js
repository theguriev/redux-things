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
            isLoading: true,
            isRefetching: !!options?.isRefetch
        }))
        onStart(action)
    }
})
