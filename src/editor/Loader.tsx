import { useEffect, useState } from '@wordpress/element'
import filters from '../filters.json'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useWpImage } from '../hooks/useWpImage'
import { uploadImage } from '../lib/processImages'
import type { Attributes, WpImage } from '../types'
import { ConfirmFileSizeNotice } from './ConfirmLargeImage'
import { Modal } from './Modal'
import { ToolbarControls, ToolbarControlsProps } from './ToolbarControls'

type LoaderProps = {
    attributes: Attributes
    setAttributes: (attributes: Attributes) => void
    clientId?: string
    CurrentMenuItems?: React.ComponentType
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
    const sourceImageId = attributes?.imageFilters?.sourceImageId
    const filteredFromImageId = attributes?.imageFilters?.filteredFromImageId
    const wpImage = useWpImage(filteredFromImageId ?? sourceImageId)
    const [accept, setAccept] = useLocalStorage(
        `ifb-large-image-accept-${sourceImageId}`,
        false,
    )
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
        const filtersByValue = Object.fromEntries(
            Object.entries(filters).map((i) => i.reverse()),
        )
        const getHref = (dest: string) => {
            if (dest === 'media') return newImage?.source_url
            if (dest === 'attachment') return newImage?.link
            return attributes?.href
        }
        setAttributes({
            id: newImage.id,
            caption: newImage.caption.raw,
            linkDestination: attributes?.linkDestination ?? '',
            linkTarget: attributes?.linkTarget ?? '',
            linkClass: attributes?.linkClass ?? '',
            rel: attributes?.rel ?? '',
            href: getHref(attributes?.linkDestination),
            url: newImage.source_url,
            alt: newImage.alt_text,
            imageFilters: {
                sourceImageId: newImage.id,
                currentImageId: newImage.id,
                currentFilterSlug: filtersByValue[filterName],
                filteredFromImageId:
                    attributes?.imageFilters?.filteredFromImageId ??
                    attributes.imageFilters.sourceImageId,
            },
        })
        setShowFilters(false)
    }

    useEffect(() => {
        const namespace = 'kevinbatdorf/open-image-filters'
        const open = (event: CustomEvent<{ clientId: string }>) => {
            if (event?.detail?.clientId !== clientId) return
            setShowFilters(true)
        }
        window.addEventListener(namespace, open as (e: Event) => void)
        return () => {
            window.removeEventListener(namespace, open as (e: Event) => void)
        }
    }, [clientId])

    useEffect(() => {
        if (attributes?.imageFilters?.sourceImageId === attributes.id) {
            return
        }
        setAttributes({
            ...attributes,
            imageFilters: {
                sourceImageId: Number(attributes.id),
                currentImageId: undefined,
                currentFilterSlug: undefined,
                filteredFromImageId: undefined,
            },
        })
    }, [attributes, setAttributes, wpImage])

    useEffect(() => {
        if (!attributes?.imageFilters?.currentImageId) return
        if (attributes.id === attributes?.imageFilters?.currentImageId) return
        // If the source image (which the user can change) doesn't match the current image, basically we need to reset the state.
        setAttributes({
            ...attributes,
            imageFilters: {
                sourceImageId: Number(attributes.id),
                currentImageId: undefined,
                currentFilterSlug: undefined,
                filteredFromImageId: undefined,
            },
        })
    }, [setAttributes, attributes])

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
                attributes={attributes}
                // blockType={block.name}
                clientId={clientId}
                setAttributes={setAttributes}
                open={showFilters}
                setImage={setImage}
                onClose={() => setShowFilters(false)}
            />
        </>
    )
}
