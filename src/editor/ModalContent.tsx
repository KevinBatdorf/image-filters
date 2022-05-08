import { store as blockEditorStore } from '@wordpress/block-editor'
import { useSelect } from '@wordpress/data'
import { useEffect, useState, useLayoutEffect, memo } from '@wordpress/element'
import { sprintf, __ } from '@wordpress/i18n'
import filtersList from '../filters.json'
import { useIsMounted } from '../hooks/useIsMounted'
import { useWpImage } from '../hooks/useWpImage'
import { AttributesNative } from '../types'
import { FilteredImage } from './FilteredImage'

type ModalContentProps = {
    attributes: AttributesNative
    setImage: (image: ImageData, filterName: string) => void
    setInfoMessage: (message: string) => void
    clientId?: string
}

export const ModalContent = memo(function ModalContent({
    attributes,
    setImage,
    setInfoMessage,
    clientId,
}: ModalContentProps) {
    const { sourceImageId, filteredFromImageId } = attributes
    const wpImage = useWpImage(filteredFromImageId ?? sourceImageId)
    const [errorMessage, setErrorMessage] = useState('')
    const [generated, setGenerated] = useState<string[]>([])
    const isMounted = useIsMounted()
    const block = useSelect(
        (select) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore-next-line - replaceBlock not added as a type?
            return select(blockEditorStore).getBlock(clientId ?? '')
        },
        [clientId],
    )

    useEffect(() => {
        if (!wpImage?.source_url) return
        // Set the first one to start generating
        setGenerated([Object.values(filtersList)[0]])
    }, [wpImage])

    useEffect(() => {
        setInfoMessage(getInfoMessage(generated.length))
    }, [generated, setInfoMessage])

    useLayoutEffect(() => {
        if (
            attributes.imageFiltersBlockType === 'kevinbatdorf/image-filters' &&
            block &&
            !block?.innerBlocks[0]
        ) {
            setErrorMessage(
                __(
                    'No image block found. Image Filters requires an image block in the first position.',
                    'image-filters',
                ),
            )
            return
        }
        if (!wpImage?.source_url) {
            setErrorMessage(
                __(
                    'No image found. Set an image first before applying filters.',
                    'image-filters',
                ),
            )
            return
        }
        setErrorMessage('')
    }, [wpImage, block, attributes.imageFiltersBlockType])

    if (errorMessage) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p className="m-0 p-0 text-md font-bold">{errorMessage}</p>
            </div>
        )
    }

    return (
        <div className="overflow-y-scroll h-full flex flex-col items-center">
            <div className="grid w-full sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-gray-50">
                {wpImage?.source_url &&
                    generated.map((name) => (
                        <FilteredImage
                            key={name}
                            name={name}
                            sourceUrl={wpImage.source_url}
                            setLoaded={() => {
                                const filtersV = Object.values(filtersList)
                                if (filtersV.length === generated.length) return
                                if (isMounted) {
                                    const nextFilter =
                                        filtersV[generated?.length]
                                    setGenerated([...generated, nextFilter])
                                }
                            }}
                            currentFilter={attributes.currentFilterSlug ?? ''}
                            setImage={setImage}
                        />
                    ))}
                {Object.keys(filtersList)
                    .slice(generated.length)
                    .map((_, i, all) => {
                        const opacity =
                            all.length / (Math.max(i, all.length / 2) + 1) - 1
                        const aspectRatio = wpImage?.media_details?.width
                            ? String(
                                  wpImage?.media_details?.width /
                                      wpImage?.media_details?.height,
                              )
                            : undefined
                        return (
                            <div
                                style={{
                                    aspectRatio,
                                    opacity,
                                }}
                                key={i}
                                className={`bg-gray-100 overflow-hidden w-full m-0 p-0 flex items-center justify-center border ${
                                    opacity > 0.5
                                        ? 'animate-pulse'
                                        : 'animate-pulse-light'
                                }`}
                            />
                        )
                    })}
            </div>
        </div>
    )
})

const getInfoMessage = (loaded: number) => {
    if (loaded === Object.keys(filtersList).length) {
        return ''
    }
    return sprintf(
        __('Generating %1$s of %2$s filters...', 'image-filters'),
        loaded,
        Object.keys(filtersList).length,
    )
}
