/* eslint-disable no-param-reassign */
import { useEffect } from 'react'
import { useStore } from 'react-redux'
import { omit } from 'lodash-es'
import { combineReducers } from '@reduxjs/toolkit'

export const setupAsyncReducers = (store, staticReducer) => {
    store.asyncReducers = {}
    store.updateReducer = () => {
        store.replaceReducer(
            combineReducers({
                ...staticReducer,
                ...store.asyncReducers
            })
        )
    }

    store.injectReducer = (key, asyncReducer) => {
        store.asyncReducers[key] = asyncReducer
        store.updateReducer()
    }
    store.withdrawReducer = key => {
        store.asyncReducer = omit(store.asyncReducers, [key])
        store.updateReducer()
    }
    return store
}

export const useInjectReducer = (key, reducer) => {
    const store = useStore()

    useEffect(() => {
        if (!store.asyncReducers[key]) {
            store.injectReducer(key, reducer)
        }
        return () => {
            store.withdrawReducer(key)
        }
    }, [key, reducer, store])
    return store
}
