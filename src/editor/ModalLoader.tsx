import { useEffect, useState } from '@wordpress/element'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useWpImage } from '../hooks/useWpImage'
import { toHumanBytes } from '../lib/utils'
import type { Attributes } from '../types'
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
    const [imageSize, setImageSize] = useState('')
    const { originalImageId } = attributes
    const wpImage = useWpImage(originalImageId)
    const [accept, setAccept] = useLocalStorage(
        `ifb-large-image-accept-${originalImageId}`,
        false,
    )

    const handleShow = () => {
        if (!accept && imageSize && !imageSize?.endsWith('Kb')) {
            setShowFileSizeNotice(true)
            return
        }
        setShowFilters(true)
    }

    useEffect(() => {
        if (!wpImage) return
        fetch(wpImage.source_url, { method: 'HEAD' }).then((response) => {
            const contentLength =
                Number(response.headers.get('content-length')) ?? 0
            setImageSize(toHumanBytes(contentLength))
        })
    }, [wpImage])

    return (
        <>
            <ToolbarControls openFilters={handleShow} />
            <ConfirmFileSizeNotice
                open={showFileSizeNotice}
                onClose={() => setShowFileSizeNotice(false)}
                accept={() => {
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
                onClose={() => setShowFilters(false)}
            />
        </>
    )
}
