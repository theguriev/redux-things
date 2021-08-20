export default ({
    fetchFn, options, dispatch, getState, extra, key
}) => ({
    promiseFn: () => fetchFn({
        options,
        dispatch,
        getState,
        extra,
        key
    })
})
