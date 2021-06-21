import { runOrDefault } from './index'

describe('runOrDefault', () => {
    it('should run the fn candidate from arguments', async () => {
        const result = runOrDefault(({ message }) => message, () => undefined, { message: 'hello' })
        expect(result).toBe('hello')
    })

    it('should run the default function', async () => {
        const result = runOrDefault('default function', message => message, { willNot: 'be used' })
        expect(result).toBe('default function')
    })
})
