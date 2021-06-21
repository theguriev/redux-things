import { createReducer } from './index'

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

describe('createReducer', () => {
    it('should go trough flow', () => {
        const result = reducer({}, { type: 'testFlow' })
        expect(result.hello).toBe('world')
        expect(result.values).toEqual([1, 2, 3])
    })

    it('should go trough flow', () => {
        const result = reducer({ initial: 'state' }, { type: 'testFunction' }, { some: 'extra stuff' })
        expect(result).toEqual({ some: 'extra stuff' })
    })
})
