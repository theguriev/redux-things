import addOptions from './addOptions'

describe('addOptions', () => {
    test('add options as a string', async () => {
        const options = addOptions({
            launchOptions: 'simple string'
        })
        expect(options).toEqual({ options: 'simple string' })
    })
})
