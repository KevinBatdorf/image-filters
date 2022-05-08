import { store as blockEditorStore } from '@wordpress/block-editor'
import { createBlock } from '@wordpress/blocks'
import { useSelect, useDispatch } from '@wordpress/data'
import { useEffect, useState } from '@wordpress/element'
import type { Component } from '@wordpress/element'
import filters from '../filters.json'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useNormalizedAttributes } from '../hooks/useNormalizedAttributes'
import { useWpImage } from '../hooks/useWpImage'
import { uploadImage } from '../lib/processImages'
import type { Attributes, ImageLike, WpImage } from '../types'
import { ConfirmFileSizeNotice } from './ConfirmLargeImage'
import { Modal } from './Modal'
import { ToolbarControls, ToolbarControlsProps } from './ToolbarControls'

type LoaderProps = {
    attributes: Attributes
    setAttributes: (attributes: Attributes) => void
    clientId?: string
    CurrentMenuItems?: typeof Component
    toolbarProps?: ToolbarControlsProps
}

export const Loader = ({
    attributes,
    setAttributes,
    clientId,
    CurrentMenuItems,
    toolbarProps,
}: LoaderProps) => {
    const [showFilters, setShowFilters] = useState(false)
    const [showFileSizeNotice, setShowFileSizeNotice] = useState(false)
    const [imageSize, setImageSize] = useState(0)
    const block = useSelect(
        (select) =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore-next-line - replaceBlock not added as a type?
            select(blockEditorStore).getBlock(clientId ?? ''),
        [clientId],
    )
    // Normalize the attribute data
    const [nAttributes, setNAttributes] = useNormalizedAttributes(
        block?.name,
        attributes,
        setAttributes,
    )
    console.log({ nAttributes, attributes })
    const { sourceImageId, filteredFromImageId } = nAttributes
    const wpImage = useWpImage(filteredFromImageId ?? sourceImageId)
    const [accept, setAccept] = useLocalStorage(
        `ifb-large-image-accept-${sourceImageId}`,
        false,
    )
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line - replaceBlock not added as a type?
    const { replaceBlock } = useDispatch(blockEditorStore)
    const handleShow = () => {
        if (!accept && imageSize && imageSize > 1_000_000) {
            setShowFileSizeNotice(true)
            return
        }
        setShowFilters(true)
    }

    const setImage = async (image: ImageData, filterName: string) => {
        if (!wpImage) return
        const newImage: WpImage | undefined = await uploadImage(image, wpImage)
        if (!newImage) return
        if (block.name === 'kevinbatdorf/image-filters') {
            const newBlock = createBlock('core/image', {
                id: newImage.id,
                caption: newImage.caption.raw,
                url: newImage.source_url,
                alt: newImage.alt_text,
            })
            await replaceBlock(block.innerBlocks[0].clientId, [newBlock])
        }
        if ('id' in nAttributes) {
            nAttributes.id = newImage.id
            nAttributes.caption = newImage.caption.raw
            nAttributes.url = newImage.source_url
            nAttributes.alt = newImage.alt_text
        }
        const filtersByValue = Object.fromEntries(
            Object.entries(filters).map((i) => i.reverse()),
        )
        setNAttributes({
            ...(nAttributes as ImageLike),
            sourceImageId: newImage.id,
            currentImageId: newImage.id,
            currentFilterSlug: filtersByValue[filterName],
            filteredFromImageId:
                nAttributes?.filteredFromImageId ?? nAttributes.sourceImageId,
        })
        setShowFilters(false)
    }

    useEffect(() => {
        const innerBlockData = block?.innerBlocks[0]
        if (nAttributes.sourceImageId && !nAttributes.currentImageId) return
        let newId
        // Reminder: we handle two scenarios, our native block and the core/image block as a filter
        if (
            block.name === 'kevinbatdorf/image-filters' &&
            innerBlockData?.attributes?.id !== nAttributes.currentImageId
        ) {
            newId = innerBlockData?.attributes?.id
        }

        if (
            block.name === 'core/image' &&
            'id' in nAttributes &&
            nAttributes.id !== nAttributes.currentImageId
        ) {
            newId = nAttributes.id
        }
        if (!newId) return
        // If the source image (which the user can change) doesn't match the current image, basically we need to reset the state.
        setNAttributes({
            ...(nAttributes as ImageLike),
            sourceImageId: Number(newId),
            currentImageId: undefined,
            currentFilterSlug: undefined,
            filteredFromImageId: undefined,
        })
    }, [
        setNAttributes,
        nAttributes,
        sourceImageId,
        block.name,
        block?.innerBlocks,
    ])

    useEffect(() => {
        if (!wpImage) return
        fetch(wpImage.source_url, { method: 'HEAD' }).then((response) => {
            const contentLength =
                Number(response.headers.get('content-length')) ?? 0
            setImageSize(contentLength)
        })
    }, [wpImage])

    return (
        <>
            <ToolbarControls
                block={block}
                clientId={clientId}
                CurrentMenuItems={CurrentMenuItems}
                toolbarProps={toolbarProps}
                openFilters={handleShow}
            />
            <ConfirmFileSizeNotice
                open={showFileSizeNotice}
                onClose={() => setShowFileSizeNotice(false)}
                onAccept={() => {
                    setShowFileSizeNotice(false)
                    setShowFilters(true)
                }}
                onAcceptPersist={() => {
                    setAccept(true)
                    setShowFileSizeNotice(false)
                    setShowFilters(true)
                }}
                size={imageSize}
            />
            <Modal
                attributes={nAttributes}
                // blockType={block.name}
                clientId={clientId}
                setAttributes={setNAttributes}
                open={showFilters}
                setImage={setImage}
                onClose={() => setShowFilters(false)}
            />
        </>
    )
}
