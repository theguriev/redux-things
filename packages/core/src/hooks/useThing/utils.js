import { NAMESPACE } from '@/constants'

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
