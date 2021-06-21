import { setWith, clone } from 'lodash-es'

/**
 * Immutable lodash set
 * @param {object} state The object to modify.
 * @param {path} path The path of the property to set.
 * @param {value} value The value to set.
 */
export const set = (state, path, value) => setWith(clone(state), path, value, clone)
