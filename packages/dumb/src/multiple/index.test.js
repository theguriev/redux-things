import { multiple } from './index'

const sum = (acc, [one, two]) => acc + one + two

describe('multiple', () => {
    it('should run "sum" function for each pair: [1, 3], [2, 4]', async () => {
        expect(multiple(sum)([[1, 2], [3, 4]])(0)).toBe(10)
    })

    it('should run "sum" for one pair', async () => {
        expect(multiple(sum)(1, 2)(0)).toBe(3)
    })
})
