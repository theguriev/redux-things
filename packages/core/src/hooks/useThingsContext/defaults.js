import { objectHash as objectToHashFn } from '@/utils'

export const defaultReducer = (state, { type, payload: data }, { toType }) => {
    if (type === toType('fulfilled')) {
        return {
            ...state,
            data
        }
    }
    return state || {}
}

export const defaultSelector = (state, _options, { key }) => state?.[key]?.data || null

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
    refetchOnWindowFocus: false,
    refetchInterval: null,
    refetchIntervalInBackground: false,
    namespace: '@redux-things',
    delimiter: '/',
    objectToHashFn
}
