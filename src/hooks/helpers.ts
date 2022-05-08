import { useRef, useEffect } from '@wordpress/element'

export const useWhyDidYouUpdate = (
    name: string,
    props: { [x: string]: unknown },
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const previousProps = useRef<{ [x: string]: unknown }>({})
    useEffect(() => {
        if (previousProps.current) {
            const allKeys = Object.keys({ ...previousProps.current, ...props })
            const changesObj = {}
            allKeys.forEach((key: string) => {
                if (previousProps.current[key] !== props[key]) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore-next-line
                    changesObj[key] = {
                        from: previousProps.current[key],
                        to: props[key],
                    }
                }
            })
            if (Object.keys(changesObj).length) {
                console.log('[why-did-you-update]', name, changesObj)
            }
        }
        previousProps.current = props
    })
}
