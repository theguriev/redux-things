import { Types } from '../utils'

export default ({
    dispatch,
    toType,
    setState,
    hash,
    key,
    options,
    onStart
}) => ({
    onStart: () => {
        const action = {
            type: toType(Types.Pending),
            hash,
            key
        }
        dispatch(action)
        setState(state => ({
            ...state,
            isLoading: true,
            isRefetching: !!options?.isRefetch
        }))
        onStart(action)
    }
})
