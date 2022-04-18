import { useSelect } from '@wordpress/data'
import { useEffect } from '@wordpress/element'
import type { Attributes } from '../types'
import './editor.css'

export type ImageContainerProps = {
    attributes: Attributes
    setAttributes: (attributes: Attributes) => void
    children: JSX.Element
    clientId: string
}

export const ImageContainer = ({
    clientId,
    attributes,
    setAttributes,
    children: innerBlock,
}: ImageContainerProps) => {
    const { getBlock } = useSelect((s) => s('core/block-editor'))
    const innerBlockData = getBlock(clientId)?.innerBlocks[0]
    const originalImageId = innerBlockData?.attributes?.id
    useEffect(() => {
        // if no current image is set, this is the first run
        if (!attributes?.currentImageId) {
            setAttributes({ ...attributes, currentImageId: originalImageId })
        }
        // If the current image no
        if (attributes?.currentImageId !== originalImageId) {
            setAttributes({ ...attributes, originalImageId })
        }
    }, [attributes, originalImageId, setAttributes])
    return <div>{innerBlock}</div>
}
