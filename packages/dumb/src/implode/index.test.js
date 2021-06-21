import { implode } from './index'

describe('implode', () => {
    it('should compile a string from delimiter and rest arguments', async () => {
        expect(implode('/', 'one', 'two', 'three')).toBe('one/two/three')
    })
})
