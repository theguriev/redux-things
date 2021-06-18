import { concat } from './index'

const initialObject = {
    data: {
        sourceOption: { abc: [1, 2, 3] },
        two: { abc2: [3, 4, 5] }
    },
    targetOption: {
        abc3: [6, 7, 8]
    }
}

describe('concat', () => {
    it('should concat arrays by path', async () => {
        const newObject = concat('data.sourceOption.abc', 'targetOption.abc3')(initialObject)
        expect(newObject.targetOption.abc3).toEqual([6, 7, 8, 1, 2, 3])
    })

    it('should concat arrays by value', async () => {
        const newObject = concat(() => (['value']), 'targetOption.abc3')(initialObject)
        expect(newObject.targetOption.abc3).toEqual([6, 7, 8, 'value'])
    })

    it('should concat arrays by value and path', async () => {
        const newObject = concat(
            [
                'data.sourceOption.abc',
                () => (['value'])
            ],
            [
                'targetOption.abc3',
                'targetOption.abc3'
            ]
        )(initialObject)
        expect(newObject.targetOption.abc3).toEqual([6, 7, 8, 1, 2, 3, 'value'])
    })
})
