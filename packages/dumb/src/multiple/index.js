import { cond, stubTrue } from 'lodash-es'

export const multiple = fn => (source, target) => {
    const isArray = () => Array.isArray(source)
    const runForArray = initial => source.reduce(fn, initial)
    const runForOne = initial => fn(initial, [source, target])

    return cond([
        [isArray, runForArray],
        [stubTrue, runForOne]
    ])
}
