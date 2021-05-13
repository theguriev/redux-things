import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { setupAsyncReducers } from '@redux-things/core'

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
}

const store = setupAsyncReducers(
    createStore(
        v => v,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ),
    {}
)

export const StoreDecorator = (StoryFn) => (
    <Provider store={store}>
        <StoryFn />
    </Provider>
)

export const decorators = [
    StoreDecorator
]
