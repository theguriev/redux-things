import {
    get,
    cond,
    isFunction,
    stubTrue
} from 'lodash-es'
import { set } from '../set'
import { multiple } from '../multiple'

const mergeOne = (obj, [source, target]) => set(
    obj,
    target,
    {
        ...get(obj, target, Object.create(null)),
        ...cond([
            [isFunction, fn => fn(obj)],
            [stubTrue, path => get(obj, path, Object.create(null))]
        ])(source)
    }
)

export const merge = multiple(mergeOne)
