export const Types = {
    Pending: 'pending',
    Fulfilled: 'fulfilled',
    Error: 'error'
}

export const thingReducer = (
    state,
    { type, fetchMoreOptions, canFetchMore },
    { toType }
) => {
    if (type === toType(Types.Fulfilled)) {
        return {
            ...state,
            fetchMoreOptions,
            canFetchMore
        }
    }
    return state || {}
}
