import addPromiseFn from './addPromiseFn'

describe('addPromiseFn', () => {
    test('add options as a string', async () => {
        const options = addPromiseFn({
            fetchFn: args => Promise.resolve(args),
            options: 'options',
            dispatch: 'dispatch',
            getState: 'getState',
            extra: 'extra'
        })
        const res = await options.promiseFn()
        expect(res).toEqual({
            options: 'options',
            dispatch: 'dispatch',
            getState: 'getState',
            extra: 'extra'
        })
    })
})
