import { objectToHashFn } from '@redux-things/mocks'
import addHash from './addHash'

describe('addHash', () => {
    test('add hash option', async () => {
        const res = addHash({
            objectToHashFn,
            options: { abc: 123 }
        })
        expect(res.hash).toBe('{"abc":123}')
    })
})
