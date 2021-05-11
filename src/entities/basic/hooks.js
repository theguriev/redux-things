import { useEntity } from '@/hooks'
import { fakeFetch } from '@/utils'
import { KEY } from './constants'

export const useBasicEntity = props => useEntity(
    KEY,
    options => fakeFetch(options ? `We can also use options in our fetchFn: ${options}` : 'Hello word! 😇', 1000),
    props
)

export const useBasicEntity2 = props => useEntity(
    KEY + 2,
    options => fakeFetch(options ? `We can also use options in our fetchFn: ${options}` : 'Hello word! 😇', 1000),
    props
)

export const useFetchMoreEntity = props => useEntity(
    KEY + 3,
    ({ limit = 2, offset = 0 }) => {
        const items = Array.from({ length: 10 }).map((_el, index) => `item-${index}`)
        return fakeFetch(items.slice(offset, offset + limit), 1000)
    },
    props
)

export const usePreFetchEntity = props => useEntity(
    KEY + 3,
    ({ limit = 2, offset = 0 }) => {
        const items = Array.from({ length: 10 }).map((_el, index) => `item-${index}`)
        return fakeFetch(items.slice(offset, offset + limit), 1000)
    },
    props
)

useBasicEntity.initialData = 'Initial data here, wait 1 second ✋🏻'
