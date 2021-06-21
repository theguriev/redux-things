import {
    get,
    constant
} from 'lodash-es'
import { set } from '../set'
import { multiple } from '../multiple'
import { runOrDefault } from '../runOrDefault'

const copyOne = (obj, [source, target]) => set(
    obj,
    runOrDefault(target, constant(target), obj),
    runOrDefault(source, path => get(obj, path), obj)
)

export const copy = multiple(copyOne)
