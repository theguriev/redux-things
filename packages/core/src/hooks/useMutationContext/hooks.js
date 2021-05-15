import { useContext } from 'react'
import { MutationContext } from './context'
import { mutationDefaults } from './defaults'

export const useMutationContext = (optionsToMerge = {}) => ({
    ...mutationDefaults,
    ...useContext(MutationContext),
    ...optionsToMerge
})
