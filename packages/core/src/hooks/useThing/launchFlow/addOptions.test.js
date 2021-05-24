import addOptions from './addOptions'

describe('addOptions', () => {
    test('add options as a string', async () => {
        const options = addOptions({
            launchOptions: 'simple string',
            key: 'TTest'
        })
        expect(options).toEqual({ options: 'simple string' })
    })

    test('add options as a object', async () => {
        const options = addOptions({
            launchOptions: { abc: 123 },
            key: 'TTest'
        })
        expect(options).toEqual({
            options: {
                abc: 123,
                __THING_KEY__: 'TTest'
            }
        })
    })
})
