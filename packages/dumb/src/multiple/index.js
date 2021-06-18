import { castArray, zip } from 'lodash-es'

export const multiple = fn => (source, target) => initial => zip(
    castArray(source),
    castArray(target)
).reduce(
    fn,
    initial
)
