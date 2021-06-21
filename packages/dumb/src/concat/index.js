import { get } from 'lodash-es'
import { set } from '../set'
import { multiple } from '../multiple'
import { runOrDefault } from '../runOrDefault'

const concatOne = (obj, [source, target]) => set(
    obj,
    target,
    [
        ...get(obj, target, []),
        ...runOrDefault(source, path => get(obj, path, []), obj)
    ]
)

export const concat = multiple(concatOne)
