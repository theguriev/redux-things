import { set } from './index'

const initialObject = {
    a: {
        b: {
            c: {
                d: 1
            }
        }
    }
}

describe('set', () => {
    it('should be immutable', async () => {
        const finalObject = set(initialObject, 'a.b.c', 2)
        expect(initialObject).toEqual({
            a: {
                b: {
                    c: {
                        d: 1
                    }
                }
            }
        })
        expect(finalObject).toEqual({
            a: {
                b: {
                    c: 2
                }
            }
        })
    })
})
