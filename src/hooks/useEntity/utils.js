/* eslint-disable no-use-before-define */
import { omit } from 'lodash-es'
import { ENTITIES_NAMESPACE } from '@/constants'

export const defaultReducer = key => (state, { type, payload: data }) => {
    if (type === `${ENTITIES_NAMESPACE}/${key}/fulfilled`) {
        return {
            ...state,
            data
        }
    }
    return state || {}
}

export const defaultSelector = (state, _options, key) => state?.[key]?.data || null

export const entityReducer = key => (
    state,
    { type, fetchMoreOptions, canFetchMore }
) => {
    const targetType = `${ENTITIES_NAMESPACE}/${key}/fulfilled`
    const removeFetchMoreOptionsType = `${ENTITIES_NAMESPACE}/${key}/removeFetchMoreOptions`
    if (type === targetType) {
        return {
            ...state,
            fetchMoreOptions,
            canFetchMore
        }
    }
    if (type === removeFetchMoreOptionsType) {
        return omit(state, ['fetchMoreOptions', 'canFetchMore'])
    }
    return state || {}
}
