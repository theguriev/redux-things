import objectHash from 'object-hash'

export const mutationDefaults = {
    mutationKey: 'global',
    onStart: () => {},
    onSuccess: () => {},
    onError: () => {},
    namespace: '@redux-things/mutation',
    delimiter: '/',
    objectToHashFn: object => objectHash(object, { unorderedObjects: true })
}
