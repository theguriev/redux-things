import { useContext } from 'react'
import { ThingsContext } from './context'

export const useThingsContext = (optionsToMerge = {}) => ({
    ...useContext(ThingsContext),
    ...optionsToMerge
})
