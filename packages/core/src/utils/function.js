export const isFunction = value => typeof value === 'function'
export const toFunction = value => (isFunction(value) ? value : () => value)
