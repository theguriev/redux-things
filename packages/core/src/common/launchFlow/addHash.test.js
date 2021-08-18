import { objectToHashFn } from '@redux-things/mocks'
import addHash from './addHash'

describe('addHash', () => {
    test('add hash option', async () => {
        const res = addHash({
            objectToHashFn,
            options: { abc: 123 },
            key: 'TTest'
        })
        expect(res.hash).toBe('{"abc":123,"__THING_KEY__":"TTest"}')
    })
})
