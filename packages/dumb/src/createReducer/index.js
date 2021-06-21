import { flow } from '../flow'

const wrap = (state, action, extra) => ({
    state,
    action,
    extra
})

const getState = ({ state }) => state

export const createReducer = (dict, def = {}) => (state, action, extra) => {
    const fn = dict[action.type]
    if (fn) {
        if (Array.isArray(fn)) {
            return flow(wrap, ...fn, getState)(state, action, extra)
        }
        return fn(state, action, extra)
    }
    return state || def
}
