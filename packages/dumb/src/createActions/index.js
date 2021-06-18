export const createActions = (strings, toType = str => str) => strings.reduce(
    (acc, name) => ({
        ...acc,
        [name]: data => ({
            type: toType(name),
            ...data
        })
    }),
    Object.create(null)
)
