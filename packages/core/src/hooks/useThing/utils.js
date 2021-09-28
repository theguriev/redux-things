import { toPairs, fromPairs, isFunction } from 'lodash-es'
import { flow, createReducer, createActions } from '@redux-things/dumb'

export const Types = {
    Pending: 'pending',
    Fulfilled: 'fulfilled',
    Error: 'error'
}

export const fetchMoreReducer = (
    state = {},
    { fetchMoreOptions, canFetchMore }
) => ({
    ...state,
    fetchMoreOptions,
    canFetchMore
})

export const fetchMoreWithTypeCheckingReducer = (
    state,
    action,
    { toType }
) => {
    if (action.type === toType(Types.Fulfilled)) {
        return fetchMoreReducer(state, action)
    }
    return state
}

const addFetchMoreReducer = fn => {
    if (Array.isArray(fn)) {
        return [
            ...fn,
            ({ state, action, ...rest }) => ({
                ...rest,
                action,
                state: fetchMoreReducer(state, action)
            })
        ]
    }
    return flow(fn, fetchMoreReducer)
}

const prepareTypesAndFulfilled = toType => pairs => pairs.map(
    ([type, fn]) => {
        if (type === Types.Fulfilled) {
            return [
                toType(type),
                addFetchMoreReducer(fn)
            ]
        }
        return [toType(type), fn]
    }
)

export const convertObjectToReducer = (obj, toType) => createReducer(
    flow(
        toPairs,
        prepareTypesAndFulfilled(toType),
        fromPairs
    )(obj?.dictionary || {}),
    obj?.initialState || {}
)

export const converObjectToActions = (obj, toType) => createActions(
    Object.keys((obj?.dictionary || {})),
    toType
)

export const getActionsFromObjectReducer = (reducer, toType) => {
    if (isFunction(reducer)) {
        return {}
    }
    return converObjectToActions(reducer, toType)
}
