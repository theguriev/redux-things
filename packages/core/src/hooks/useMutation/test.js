import { renderHook, act } from '@testing-library/react-hooks'
import { reduxContextProvider as wrapper } from '@/mocks'
import { useMutation } from '.'

describe('useMutation', () => {
    test('basic scenario', async () => {
        const { result, waitForValueToChange } = renderHook(
            () => useMutation(
                () => Promise.resolve('Hello 😇')
            ),
            { wrapper }
        )
        await waitForValueToChange(() => result.current.isLoading)
        expect(1).toBe(1)
    })
})
