import { values, partial } from 'lodash-es'
import { createActions } from '@redux-things/dumb'
import { LauncFlowTypes } from './enums'

export const createLaunchFlowActions = partial(createActions, values(LauncFlowTypes))
