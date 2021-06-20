import { copy } from './index'

describe('copy', () => {
    it('should copy objects by path', async () => {
        const initialObject = {
            data: {
                sourceOption: { abc: 111 },
                two: { abc2: 222 }
            },
            targetOption: {
                abc3: 333
            }
        }
        const newObject = copy('data.sourceOption', 'targetOption')(initialObject)
        expect(newObject.targetOption.abc3).toBe(undefined)
        expect(newObject.targetOption.abc).toBe(111)
    })

    it('should copy objects by value', async () => {
        const initialObject = {
            data: {
                sourceOption: { abc: 111 },
                two: { abc2: 222 }
            },
            targetOption: {
                abc3: 333
            }
        }
        const newObject = copy(() => ({ value: 111 }), 'targetOption')(initialObject)
        expect(newObject.targetOption.abc3).toBe(undefined)
        expect(newObject.targetOption.value).toBe(111)
    })

    it('should copy objects by value and path', async () => {
        const initialObject = {
            data: {
                sourceOption: { abc: 111 },
                two: { abc2: 222 }
            },
            targetOption: {
                abc3: 333
            }
        }
        const newObject = copy([
            [
                () => ({ value: 111 }),
                'targetOption'
            ],
            [
                'data.sourceOption',
                'targetOption2'
            ]
        ])(initialObject)
        expect(newObject.targetOption.abc3).toBe(undefined)
        expect(newObject.targetOption.value).toBe(111)
        expect(newObject.targetOption2.abc).toBe(111)
    })

    it('should copy objects by path, target should be dynamic', async () => {
        const initialObject = {
            data: {
                sourceOption: { abc: 111 },
                two: { abc2: 222 }
            },
            targetOption: {
                abc3: 333
            },
            hash: 'two'
        }
        const newObject = copy(
            () => ({ dynamic: 'source' }),
            ({ hash }) => `data.${hash}`
        )(initialObject)
        expect(newObject.data.two.dynamic).toBe('source')
    })
})
