import { objectHash } from './index'

describe('objectHash', () => {
    it('should generate a hash from object and it should be alway the same', async () => {
        expect(objectHash({ foo: 'bar' })).toBe('a75c05bdca7d704bdfcd761913e5a4e4636e956b')
    })
})
