export const dictionaryReducer = (dict, def = {}) => (state, action, ...rest) => {
    const fn = dict[action.type]
    if (fn) {
        return fn(state, action, ...rest)
    }
    return state || def
}
