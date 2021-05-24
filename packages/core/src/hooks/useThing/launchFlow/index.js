import { propsWrapper, flow } from '@/utils'
import { default as addOptions } from './addOptions'
import { default as addHash } from './addHash'
import { default as addPromiseFn } from './addPromiseFn'
import { default as addOnStart } from './addOnStart'
import { default as addOnSuccess } from './addOnSuccess'
import { default as addOnError } from './addOnError'

const launchFlow = flow(
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

export default launchFlow
