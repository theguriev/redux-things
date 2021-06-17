import { omit } from 'lodash-es'
import { propsWrapper, flow } from '@redux-things/dumb'
import addOptions from './addOptions'
import addHash from './addHash'
import addPromiseFn from './addPromiseFn'
import addOnStart from './addOnStart'
import addOnSuccess from './addOnSuccess'
import addOnError from './addOnError'

export const launchFlow = flow(
    ...(
        [
            addOptions,
            addHash,
            addPromiseFn,
            addOnStart,
            addOnSuccess,
            addOnError
        ].map(propsWrapper)
    )
)

export const preFetchFlow = flow(
    ...(
        [
            addOptions,
            addHash,
            addPromiseFn
        ].map(propsWrapper)
    )
)

export const selectFlow = flow(
    ...(
        [
            addOptions,
            addHash
        ]
            .map(propsWrapper)
            .concat(value => omit(value, ['launchOptions', 'objectToHashFn']))
    )
)

export * from './enums'
export * from './actions'
