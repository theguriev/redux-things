/* eslint-disable no-param-reassign */
import React from 'react'
import { omit } from 'lodash-es'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

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

const store = setupAsyncReducers(createStore(v => v), {})
export const reduxContextProvider = ({ children }) => <Provider store={store}>{children}</Provider>
