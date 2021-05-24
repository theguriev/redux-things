import {
    toType,
    dispatch,
    setState,
    noop
} from '@redux-things/mocks'
import addOnError from './addOnError'

describe('addOnError', () => {
    test('add onError option | mounted', async () => {
        dispatch.clear()
        setState({ initial: true })
        let onErrorHasBeenCalled = false
        const { onError } = addOnError({
            toType,
            hash: 'hash',
            key: 'TKey',
            dispatch,
            setState,
            mountedRef: { current: true },
            onError: error => {
                onErrorHasBeenCalled = error
            }
        })
        const res = onError({ testing: true })
        expect(res.testing).toBe(true)
        expect(dispatch.actions).toMatchSnapshot()
        expect(setState.state).toMatchSnapshot()
        expect(onErrorHasBeenCalled).toMatchSnapshot()
    })

    test('add onError option | unmounted', async () => {
        setState({ nothing: { should: { change: true } } })
        const { onError } = addOnError({
            toType,
            hash: 'hash',
            key: 'TKey',
            dispatch,
            setState,
            mountedRef: { current: false },
            onError: noop
        })
        onError({ testing: true })
        expect(setState.state).toEqual({ nothing: { should: { change: true } } })
    })
})
