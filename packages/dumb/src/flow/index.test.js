import { flow } from './index'

const fn1 = (a, b) => a + b + 1

const fn2 = (a, b) => a + b + 2

describe('flow', () => {
    test('flow has pass "b" arg as well', async () => {
        expect(flow(fn1, fn2)(0, 100)).toBe(203)
    })
})
