import { useContext } from 'react'
import { ThingContext } from './context'
import { thingDefaults } from './defaults'

export const useThingContext = (optionsToMerge = {}) => ({
    ...thingDefaults,
    ...useContext(ThingContext),
    ...optionsToMerge
})
