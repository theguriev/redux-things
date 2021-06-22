import { useContext } from 'react'
import { ThingContext } from './context'
import { thingDefaults } from './defaults'

/**
 * Get ThingContext object.
 * @param {object} optionsToMerge any additional option to merge.
 * @returns ThingContext object.
 */
export const useThingContext = (optionsToMerge = {}) => ({
    ...thingDefaults,
    ...useContext(ThingContext),
    ...optionsToMerge
})
