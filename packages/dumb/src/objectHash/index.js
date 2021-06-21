import hash from 'object-hash'

export const objectHash = (object, options = {}) => hash(
    object,
    {
        unorderedObjects: true,
        ...options
    }
)
