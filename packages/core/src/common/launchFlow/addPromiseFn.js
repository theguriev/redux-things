export default ({
    fetchFn, options, dispatch, getState, extra
}) => ({
    promiseFn: () => fetchFn({
        options,
        dispatch,
        getState,
        extra
    })
})
