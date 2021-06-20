import { merge } from './index'

describe('merge', () => {
    it('should merge objects by path', async () => {
        const initialObject = {
            data: {
                sourceOption: { abc: 111 },
                two: { abc2: 222 }
            },
            targetOption: {
                abc3: 333
            }
        }
        const newObject = merge('data.sourceOption', 'targetOption')(initialObject)
        expect(newObject.targetOption.abc3).toBe(333)
        expect(newObject.targetOption.abc).toBe(111)
    })

    it('should merge objects by value', async () => {
        const initialObject = {
            data: {
                sourceOption: { abc: 111 },
                two: { abc2: 222 }
            },
            targetOption: {
                abc3: 333
            }
        }
        const newObject = merge(() => ({ value: 111 }), 'targetOption')(initialObject)
        expect(newObject.targetOption.abc3).toBe(333)
        expect(newObject.targetOption.value).toBe(111)
    })

    it('should merge objects by value and path', async () => {
        const initialObject = {
            data: {
                sourceOption: { abc: 111 },
                two: { abc2: 222 }
            },
            targetOption: {
                abc3: 333
            }
        }
        const newObject = merge([
            [
                () => ({ value: 111 }),
                'targetOption'
            ],
            [
                'data.sourceOption',
                'targetOption'
            ]
        ])(initialObject)
        expect(newObject.targetOption.abc3).toBe(333)
        expect(newObject.targetOption.value).toBe(111)
        expect(newObject.targetOption.abc).toBe(111)
    })
})