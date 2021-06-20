import {
    get,
    cond,
    isFunction,
    stubTrue,
    constant
} from 'lodash-es'
import { set } from '../set'
import { multiple } from '../multiple'

const copyOne = (obj, [source, target]) => set(
    obj,
    cond([
        [isFunction, fn => fn(obj)],
        [stubTrue, constant(target)]
    ])(target),
    cond([
        [isFunction, fn => fn(obj)],
        [stubTrue, path => get(obj, path)]
    ])(source)
)

export const copy = multiple(copyOne)
