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

/**
 * It will create a type string for action from array.
 * Example:
 * generateType('/', ['@redux-things', 'success']) === '@redux-things/success'
 *
 * @param {string} delimiter type delimiter
 * @param  {...any} rest type string parts.
 */
export const generateType = (delimiter, ...rest) => rest.join(delimiter)
