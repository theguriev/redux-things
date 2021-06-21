import {
    cond,
    isFunction,
    stubTrue
} from 'lodash-es'

export const runOrDefault = (fnCandidate, defaultFn = () => {}, ...rest) => cond([
    [isFunction, fn => fn(...rest)],
    [stubTrue, defaultFn]
])(fnCandidate)
