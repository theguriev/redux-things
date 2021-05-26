/* eslint-disable no-param-reassign */
import { useEffect } from 'react'
import { useStore } from 'react-redux'
import { omit } from 'lodash-es'
import { combineReducers } from 'redux'

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
        store.asyncReducers = omit(store.asyncReducers, [key])
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
        // If we uncomment this, then at each mounting / unmount,
        // the state will be restored by running it through the reducer.
        // It's not very good for performance.
        // But this assumes that the reducer does not change for a particular key.
        // return () => {
        //     store.withdrawReducer(key)
        // }
    }, [key, reducer, store])
    return store
}
