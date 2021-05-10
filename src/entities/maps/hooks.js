import { useEntity, useMutation } from '@/hooks'
import {
    all,
    one,
    save,
    del,
    add
} from '@/api/maps'
import { KEY } from './constants'
import { reducer } from './reducers'
import { selector, oneSelector } from './selectors'
import { initialData } from './data'

const useMutations = () => {
    const { mutate } = useMutation(
        ({ options }) => del(options),
        {
            mutationKey: `${useEntity.NAMESPACE}/${KEY}/delete`
        }
    )

    const { mutate: addMutate } = useMutation(
        ({ options }) => add(options),
        {
            mutationKey: `${useEntity.NAMESPACE}/${KEY}/add`
        }
    )

    const { mutate: saveMutate } = useMutation(
        ({ options }) => save(options),
        {
            mutationKey: `${useEntity.NAMESPACE}/${KEY}/save`
        }
    )

    return {
        del: mutate,
        add: addMutate,
        save: saveMutate
    }
}

export const useMapsEntity = (props = {}) => ({
    ...useMutations(),
    ...useEntity(
        KEY,
        options => {
            console.log('options', options)
            return Promise.resolve(Array.from({ length: 10 }).map(el => 'A'))
        },
        {
            ...props
        }
    )
})

useMapsEntity.initialData = initialData

export const useMapEntity = id => ({
    ...useMutations(),
    ...useEntity(
        KEY,
        ({ options }) => one(options).then(res => [res]),
        {
            reducer,
            selector: oneSelector,
            options: id
        }
    )
})
