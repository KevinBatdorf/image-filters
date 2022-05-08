import { useSelect } from '@wordpress/data'
import { useState, useEffect } from '@wordpress/element'
import type { WpImage } from '../types'

export const useWpImage = (imageId: number | undefined) => {
    const [wpImage, setWpImage] = useState<WpImage>()

    const image: WpImage = useSelect(
        (select) => select('core')?.getMedia(imageId),
        [imageId],
    )

    useEffect(() => {
        if (image) {
            setWpImage(image)
        }
    }, [image])

    return wpImage
}
