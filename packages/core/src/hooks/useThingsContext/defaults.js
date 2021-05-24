import objectHash from 'object-hash'

export const defaultReducer = (state, { type, payload: data }, { toType }) => {
    if (type === toType('fulfilled')) {
        return {
            ...state,
            data
        }
    }
    return state || {}
}

export const defaultSelector = (state, _options, key) => state?.[key]?.data || null

export const thingsDefaults = {
    selector: defaultSelector,
    reducer: defaultReducer,
    initialData: () => null,
    getFetchMore: () => false,
    onStart: () => {},
    onSuccess: () => {},
    onError: () => {},
    dataMapper: v => v,
    skip: false,
    cache: 'cache-first',
    options: null,
    reFetchOnWindowFocus: false,
    reFetchInterval: null,
    reFetchIntervalInBackground: false,
    namespace: '@redux-things',
    delimiter: '/',
    objectToHashFn: object => objectHash(object, { unorderedObjects: true })
}
