import { useEffect, useRef } from '@wordpress/element'

export const useIsMounted = () => {
    const isMounted = useRef(false)

    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])

    return isMounted.current
}
