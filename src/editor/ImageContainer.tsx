import { store as blockEditorStore } from '@wordpress/block-editor'
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line - replaceBlock not added as a type?
    const { getBlock } = useSelect((select) => select(blockEditorStore))
    const innerBlockData = getBlock(clientId)?.innerBlocks[0]
    const sourceImageId = innerBlockData?.attributes?.id

    useEffect(() => {
        if (sourceImageId === attributes.currentImageId) {
            return
        }
        // If the source image (which the user can change) doesn't match the current image, basically we need to reset the state.
        setAttributes({
            ...attributes,
            sourceImageId,
            currentImageId: undefined,
            currentFilterSlug: undefined,
            filteredFromImageId: undefined,
        })
    }, [sourceImageId, setAttributes, attributes])
    return innerBlock
}
