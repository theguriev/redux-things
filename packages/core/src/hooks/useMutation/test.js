import { renderHook, act } from '@testing-library/react-hooks'
import { reduxContextProvider as wrapper } from '@redux-things/mocks'
import { useMutation } from '.'

describe('useMutation', () => {
    test('basic mutation', async () => {
        const { result, waitForValueToChange } = renderHook(
            () => useMutation(
                ({ options }) => Promise.resolve(`Here we will send some data to the server 😇 ${options.test}`)
            ),
            { wrapper }
        )
        act(() => {
            result.current.mutate({ test: 'TEST OPTIONS' })
        })
        await waitForValueToChange(() => result.current.isLoading)
        expect(result.current.data).toBe('Here we will send some data to the server 😇 TEST OPTIONS')
        expect(result.all).toMatchSnapshot()
    })
})
