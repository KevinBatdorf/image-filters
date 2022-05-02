import { store as blockEditorStore } from '@wordpress/block-editor'
import { createBlock } from '@wordpress/blocks'
import { useSelect, useDispatch } from '@wordpress/data'
import { useEffect, useState } from '@wordpress/element'
import filters from '../filters.json'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useWpImage } from '../hooks/useWpImage'
import { uploadImage } from '../lib/processImages'
import type { Attributes, WpImage } from '../types'
import { ConfirmFileSizeNotice } from './ConfirmLargeImage'
import { Modal } from './Modal'
import { ToolbarControls } from './ToolbarControls'

type ModalLoaderProps = {
    attributes: Attributes
    setAttributes: (attributes: Attributes) => void
    clientId?: string
}

export const ModalLoader = ({
    attributes,
    setAttributes,
    clientId,
}: ModalLoaderProps) => {
    const [showFilters, setShowFilters] = useState(false)
    const [showFileSizeNotice, setShowFileSizeNotice] = useState(false)
    const [imageSize, setImageSize] = useState(0)
    const { sourceImageId, filteredFromImageId } = attributes
    const wpImage = useWpImage(filteredFromImageId ?? sourceImageId)
    const [accept, setAccept] = useLocalStorage(
        `ifb-large-image-accept-${sourceImageId}`,
        false,
    )
    const block = useSelect((select) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line - replaceBlock not added as a type?
        return select(blockEditorStore).getBlock(clientId ?? '')
    })
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
        const newBlock = createBlock('core/image', {
            id: newImage.id,
            caption: newImage.caption.raw,
            url: newImage.source_url,
            alt: newImage.alt_text,
        })
        await replaceBlock(block.innerBlocks[0].clientId, [newBlock])
        setShowFilters(false)
        const filtersByValue = Object.fromEntries(
            Object.entries(filters).map((i) => i.reverse()),
        )
        setAttributes({
            sourceImageId: newImage.id,
            currentImageId: newImage.id,
            currentFilterSlug: filtersByValue[filterName],
            filteredFromImageId:
                attributes?.filteredFromImageId ?? attributes.sourceImageId,
        })
    }

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
            <ToolbarControls openFilters={handleShow} />
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
                attributes={attributes}
                clientId={clientId}
                setAttributes={setAttributes}
                open={showFilters}
                setImage={setImage}
                onClose={() => setShowFilters(false)}
            />
        </>
    )
}
