import { createActions } from './index'

const addBufferWithDefaults = () => ({
    buffer: {
        hello: 'world'
    }
})

const addValuesToBuffer = ({ buffer }) => ({
    buffer: {
        ...buffer,
        values: [1, 2, 3]
    }
})

const moveBufferToState = ({ buffer }) => ({
    state: buffer
})

const reducer = createReducer({
    testFlow: [addBufferWithDefaults, addValuesToBuffer, moveBufferToState],
    testFunction: (_state, _action, extra) => extra
})

const PREFIX = 'SOME_PREFIX/'

const toType = str => `${PREFIX}${str}`

describe('createActions', () => {
    it('should create action functions based on object', () => {
        const actions = createActions({
            edit: undefined,
            add: undefined
        }, toType)
        expect(actions).toBe(1)
    })
})
