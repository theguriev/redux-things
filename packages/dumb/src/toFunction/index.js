import { isFunction } from 'lodash-es'

export const toFunction = value => (isFunction(value) ? value : () => value)
