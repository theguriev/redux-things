import { useThing } from '@redux-things/core'
import { KEY } from './constants'

export const fakeFetch = (data, delay = 300) => new Promise(
    resolve => setTimeout(() => resolve(data), delay)
)

export const useBasicEntity = props => useThing(
    KEY,
    ({ options, ...rest }) => {
        console.log('rest', rest)
        return fakeFetch(options ? `We can also use options in our fetchFn: ${options}` : 'Hello word! 😇', 1000)
    },
    props
)

export const useBasicEntity2 = props => useThing(
    KEY + 2,
    ({ options }) => fakeFetch(options ? `We can also use options in our fetchFn: ${options}` : 'Hello word! 😇', 1000),
    props
)

export const useFetchMoreEntity = props => useThing(
    KEY + 3,
    ({ options: { limit = 2, offset = 0 } }) => {
        const items = Array.from({ length: 10 }).map((_el, index) => `item-${index}`)
        return fakeFetch(items.slice(offset, offset + limit), 1000)
    },
    props
)

export const usePreFetchEntity = props => useThing(
    KEY + 3,
    ({ options: { limit = 2, offset = 0 } }) => {
        const items = Array.from({ length: 10 }).map((_el, index) => `item-${index}`)
        return fakeFetch(items.slice(offset, offset + limit), 1000)
    },
    props
)

useBasicEntity.initialData = 'Initial data here, wait 1 second ✋🏻'
