import { useSelect } from '@wordpress/data'
import { useState, useEffect } from '@wordpress/element'
import { useServer } from '../hooks/useServer'
import type { Attributes, WpImage } from '../types'

type ModalContentProps = {
    attributes: Attributes
    setAttributes: (attributes: Attributes) => void
    clientId?: string
}
export const ModalContent = ({
    attributes,
    setAttributes,
    clientId,
}: ModalContentProps) => {
    const { originalImageId } = attributes
    const [sourceUrl, setSourceUrl] = useState('')
    const originalImage: WpImage = useSelect((s) =>
        s('core')?.getMedia(originalImageId),
    )
    const server = useServer()
    console.log(originalImage)
    const loadImage = (img: any) => {
        return new Promise((resolve) => (img.onload = resolve))
    }
    const handleApplyFilter = () => {
        // setAttributes()
        console.log('here')
    }
    useEffect(() => {
        if (originalImage) {
            setSourceUrl(originalImage.source_url)
        }
    }, [originalImage])

    useEffect(() => {
        if (!server?.open_image) return
        const canvas = document.createElement('canvas')
        const img = new Image()
        img.src = sourceUrl
        console.log(img)
        loadImage(img).then(() => {
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx?.drawImage(img, 0, 0)
            const photonImage = server?.open_image(canvas, ctx)
            const pImg = server?.do_something(photonImage)
            console.log({ pImg })
            const c = document.getElementById(
                'canvas-mine',
            ) as HTMLCanvasElement
            if (c) {
                c.height = img.height
                c.width = img.width
                const ctx = c.getContext('2d')
                ctx?.putImageData(server?.to_image_data(pImg), 0, 0)
            }
        })
    }, [sourceUrl, server])

    return (
        <div className="overflow-y-scroll">
            <canvas className="w-full block" id="canvas-mine"></canvas>
        </div>
    )
}

// TODO:
// - Add revert button on sidebar
// - Add array of available filters and their functions
// - Create component to display filters
// - figure out how to save an image to the media library
// - replace the media in the inner block or just replace the entire block before closing the modal
