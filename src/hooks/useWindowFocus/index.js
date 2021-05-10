import { useState, useEffect } from 'react'

export const getEventName = () => {
    if (document.msHidden) {
        return 'msvisibilitychange'
    }
    if (document.webkitvisibilitychange) {
        return 'webkitvisibilitychange'
    }
    return 'visibilitychange'
}

export const EVENT_NAME = getEventName()

const _hasFocus = () => document.visibilityState === 'visible'

export const useWindowFocus = (skip = false) => {
    const [state, setState] = useState({
        hasFocus: _hasFocus(),
        isFirstTime: true
    })
    const handleFocus = () => setState({
        hasFocus: _hasFocus(),
        isFirstTime: false
    })

    useEffect(() => {
        // Listen to visibillitychange and focus
        if (typeof window !== 'undefined' && window.addEventListener && !skip) {
            document.addEventListener(EVENT_NAME, handleFocus, false)
            document.addEventListener('focus', handleFocus, false)
        }

        return () => {
            // Be sure to unsubscribe if a new handler is set
            document.removeEventListener(EVENT_NAME, handleFocus)
            document.removeEventListener('focus', handleFocus)
        }
    }, [])

    return state
}
