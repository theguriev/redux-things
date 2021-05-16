import { NAMESPACE } from '@/constants'

export const defaultReducer = (state, { type, payload: data }, key) => {
    if (type === `${NAMESPACE}/${key}/fulfilled`) {
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
    reFetchIntervalInBackground: false
}
