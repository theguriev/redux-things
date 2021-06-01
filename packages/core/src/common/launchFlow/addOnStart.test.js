import {
    launchFlowActions as actions,
    dispatch,
    setState
} from '@redux-things/mocks'
import addOnStart from './addOnStart'

describe('addOnStart', () => {
    test('add onStart option', async () => {
        dispatch.clear()
        let onStartHasBeenCalled = false
        const { onStart } = addOnStart({
            actions,
            hash: 'hash',
            key: 'TKey',
            dispatch,
            setState,
            onStart: result => {
                onStartHasBeenCalled = result
            }
        })
        onStart({ testing: true })
        expect(dispatch.actions).toMatchSnapshot()
        expect(setState.state).toMatchSnapshot()
        expect(onStartHasBeenCalled).toMatchSnapshot()
    })
})
