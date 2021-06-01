import { values, partial } from 'lodash-es'
import { createActions } from '@/utils/'
import { LauncFlowTypes } from './enums'

export const createLaunchFlowActions = partial(createActions, values(LauncFlowTypes))
