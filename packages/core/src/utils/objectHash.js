import hash from 'object-hash'

export const objectHash = object => hash(object, { unorderedObjects: true })
