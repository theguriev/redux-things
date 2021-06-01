import { isFunction } from 'lodash-es'

export const objectToHashFn = JSON.stringify

export const dispatch = action => {
    dispatch.actions = [...dispatch.actions, action]
}

dispatch.actions = []
dispatch.clear = () => {
    dispatch.actions = []
}

export const setState = fnOrData => {
    if (isFunction(fnOrData)) {
        setState.state = fnOrData(setState.state)
    } else {
        setState.state = {
            ...fnOrData
        }
    }
}

export const noop = () => {}

setState.state = { initial: true }
