import { get } from 'lodash-es'
import { set } from '../set'
import { multiple } from '../multiple'
import { runOrDefault } from '../runOrDefault'

const mergeOne = (obj, [source, target]) => set(
    obj,
    target,
    {
        ...get(obj, target, Object.create(null)),
        ...runOrDefault(source, path => get(obj, path, Object.create(null)), obj)
    }
)

export const merge = multiple(mergeOne)
