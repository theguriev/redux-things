import { isFunction, cond, stubTrue } from 'lodash-es'

export const toFunction = value => cond([
    [isFunction, v => v],
    [stubTrue, v => () => v]
])(value)
