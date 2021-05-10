import React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { setupAsyncReducers } from '@/hooks'

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
}

window.__MIND_MAPS__ = window.__MIND_MAPS__ || {
    url: 'http://localhost/mm/wp-json/mmb/'
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
