import { useEntity } from '@/hooks'
import { dictionaryReducer, objectHash } from '@/utils'
import { KEY } from './constants'

const create = (state, { payload: data }) => ({
    ...state,
    data: {
        ...(state?.data || {}),
        ...Object.fromEntries(data.map(el => ([el.id, el])))
    }
})

const add = (state, { payload: { data } }) => ({
    ...state,
    data: {
        ...(state?.data || {}),
        [data.id]: data
    }
})

const del = (state, { payload: data }) => ({
    ...state,
    data: Object.fromEntries(
        Object
            .entries(state?.data || {})
            .filter(([id]) => !data?.options?.includes(Number(id)))
    )
})

const dict = {
    [`${useEntity.NAMESPACE}/${KEY}/create`]: create,
    [`${useEntity.NAMESPACE}/${KEY}/delete/fulfilled`]: del,
    [`${useEntity.NAMESPACE}/${KEY}/add/fulfilled`]: add,
    [`${useEntity.NAMESPACE}/${KEY}/save/fulfilled`]: add
}

export const reducer = (...args) => dictionaryReducer(dict)(...args)
