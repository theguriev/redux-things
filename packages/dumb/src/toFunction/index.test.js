import { toFunction } from './index'

describe('toFunction', () => {
    it('should make function from whatever value', async () => {
        expect(typeof toFunction(() => {}) === 'function').toBe(true)
        expect(typeof toFunction(1) === 'function').toBe(true)
        expect(toFunction(1)()).toBe(1)
    })
})
