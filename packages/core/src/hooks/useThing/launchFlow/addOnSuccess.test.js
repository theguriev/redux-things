import { toType, dispatch, setState } from '@redux-things/mocks'
import addOnSuccess from './addOnSuccess'

describe('addOnSuccess', () => {
    test('add onSuccess option', async () => {
        dispatch.clear()
        setState({ initial: true })

        let onSuccessHasBeenCalled = false
        const { onSuccess } = addOnSuccess({
            getFetchMore: () => ({ fetchMoreOptions: 'willBeHere' }),
            selectedData: [],
            options: { abc: 123 },
            toType,
            mountedRef: { current: true },
            dispatch,
            setState,
            hash: 'hash',
            key: 'TKey',
            onSuccess: error => {
                onSuccessHasBeenCalled = error
            }
        })
        onSuccess({ testing: true })
        expect(dispatch.actions).toMatchSnapshot()
        expect(setState.state).toMatchSnapshot()
        expect(onSuccessHasBeenCalled).toMatchSnapshot()
    })
})
