export default ({ objectToHashFn, options, key }) => ({
    hash: objectToHashFn(
        typeof options === 'object' ? { ...options, __THING_KEY__: key } : options
    )
})
