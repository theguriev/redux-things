import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { setupAsyncReducers } from '@/hooks'

const store = setupAsyncReducers(
    createStore(v => v),
    {}
)

export const reduxContextProvider = ({ children }) => <Provider store={store}>{children}</Provider>
