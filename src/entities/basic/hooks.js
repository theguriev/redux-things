import { useEntity } from '@/hooks'
import { KEY } from './constants'
import { fakeFetch } from '@/utils'

export const useBasicEntity = props => {
    return useEntity(
        KEY,
        options => {
            console.log('options', options)
            return fakeFetch(options ? `We can also use options in our fetchFn: ${options}` : 'Hello word! 😇', 1000)
        },
        props
    )
}

export const useBasicEntity2 = props => {
    return useEntity(
        KEY + 2,
        options => {
            return fakeFetch(options ? `We can also use options in our fetchFn: ${options}` : 'Hello word! 😇', 1000)
        },
        props
    )
}

export const useFetchMoreEntity = props => {
    return useEntity(
        KEY + 3,
        ({ limit = 2, offset = 0 }) => {
            const items = Array.from({ length: 10 }).map((el, index)=> 'item-' + index)
            return fakeFetch(items.slice(offset, offset + limit), 1000)
        },
        props
    )
}

useBasicEntity.initialData = 'Initial data here, wait 1 second ✋🏻'
