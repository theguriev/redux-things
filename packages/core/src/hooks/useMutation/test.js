import { renderHook, act } from '@testing-library/react-hooks'
import { reduxContextProvider as wrapper } from '@/mocks'
import { useMutation } from '.'

describe('useMutation', () => {
    test('basic mutation', async () => {
        let res = ''
        const { result, waitForValueToChange } = renderHook(
            () => useMutation(
                (options) => Promise.resolve(`Here we will send some data to the server 😇 ${options.test}`)
            ),
            { wrapper }
        )
        act(() => {
            result.current.mutate({ test: 'TEST OPTIONS' }).then(
                data => {
                    res = data
                }
            )
        })
        await waitForValueToChange(() => result.current.isLoading)
        expect(result.current.data).toBe('Here we will send some data to the server 😇 TEST OPTIONS')
        expect(result.all).toMatchSnapshot()
    })
})
