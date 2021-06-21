import { createActions } from './index'

const PREFIX = 'SOME_PREFIX/'

const toType = str => `${PREFIX}${str}`

describe('createActions', () => {
    it('should create action functions based on array', () => {
        const actions = createActions(['edit', 'add'], toType)
        expect(typeof actions.edit).toBe('function')
        expect(typeof actions.add).toBe('function')

        const generatedAction = actions.edit({ hello: 'world' })

        expect(generatedAction.type).toBe(`${PREFIX}edit`)
        expect(generatedAction.hello).toBe('world')
    })
})
