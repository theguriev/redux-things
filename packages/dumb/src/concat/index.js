import {
    get,
    cond,
    isFunction,
    stubTrue
} from 'lodash-es'
import { set } from '../set'
import { multiple } from '../multiple'

const concatOne = (obj, [source, target]) => set(
    obj,
    target,
    [
        ...get(obj, target, []),
        ...cond([
            [isFunction, fn => fn(obj)],
            [stubTrue, path => get(obj, path, [])]
        ])(source)
    ]
)

export const concat = multiple(concatOne)
