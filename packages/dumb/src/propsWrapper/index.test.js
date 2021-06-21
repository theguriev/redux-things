import { toPairs, fromPairs } from 'lodash-es'
import { propsWrapper } from './index'

const fn = props => fromPairs(toPairs(props).map(([key, value]) => ([`${key}2`, `${value}2`])))

describe('propsWrapper', () => {
    it('should wrap props with result of function', async () => {
        expect(propsWrapper(fn)({ foo: 'bar' })).toEqual({
            foo: 'bar',
            foo2: 'bar2'
        })
    })
})
