import { useRef, useEffect } from 'react'

export const useCompareEffect = (effect, dependencies, compareFn) => {
    const ref = useRef(dependencies)
    if (!compareFn(dependencies, ref.current)) {
        ref.current = dependencies
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, ref.current)
}
