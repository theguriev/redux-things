import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { setupAsyncReducers, ThingsContext } from '@redux-things/core'

export const parameters = {
    options: {
        storySort: {
            order: ['Getting Started', ['Introduction', 'Installation'], 'Concepts', ['Things', 'Mutations']],
        }
    }
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

export const ThingsDecorator = StoryFn => (
    <ThingsContext.Provider value={{ apiClient: () => console.log('apiclient') }}>
        <StoryFn />
    </ThingsContext.Provider>
)

export const decorators = [
    StoreDecorator,
    ThingsDecorator
]
