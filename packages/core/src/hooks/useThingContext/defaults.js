import { objectHash as objectToHashFn } from '@redux-things/dumb'

export const defaultReducer = (state, { type, payload: data }, { toType }) => {
    if (type === toType('fulfilled')) {
        return {
            ...state,
            data
        }
    }
    return state || {}
}

export const defaultSelector = (state, { key }) => state?.[key]?.data || null

export const thingDefaults = {
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
    refetchOnWindowFocus: false,
    refetchInterval: null,
    refetchIntervalInBackground: false,
    namespace: '@redux-things',
    delimiter: '/',
    objectToHashFn,
    debounceInterval: 0
}
