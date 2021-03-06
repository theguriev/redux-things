/**
 * Classic flow is not good enough because it doesn't pass all arguments
 * @param  {...any} funcs Whatever functions.
 */
export const flow = (...funcs) => {
    const { length } = funcs
    return (first, ...args) => {
        let index = 0
        let result = length ? funcs[index].apply(this, [first, ...args]) : first
        // eslint-disable-next-line no-plusplus
        while (++index < length) {
            result = funcs[index].apply(this, [result, ...args])
        }
        return result
    }
}
