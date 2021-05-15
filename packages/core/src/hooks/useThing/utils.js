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

export const entityReducer = (
    state,
    { type, fetchMoreOptions, canFetchMore },
    key
) => {
    const targetType = `${NAMESPACE}/${key}/fulfilled`
    if (type === targetType) {
        return {
            ...state,
            fetchMoreOptions,
            canFetchMore
        }
    }
    return state || {}
}
