import { useContext } from 'react'
import { ThingsContext } from './context'
import { thingsDefaults } from './defaults'

export const useThingsContext = (optionsToMerge = {}) => ({
    ...thingsDefaults,
    ...useContext(ThingsContext),
    ...optionsToMerge
})
