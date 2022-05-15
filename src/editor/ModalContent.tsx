import {
    useEffect,
    useRef,
    useState,
    useLayoutEffect,
    memo,
    useCallback,
} from '@wordpress/element'
import { sprintf, __ } from '@wordpress/i18n'
import filtersList from '../filters.json'
import { useIsMounted } from '../hooks/useIsMounted'
import { useWpImage } from '../hooks/useWpImage'
import { Attributes } from '../types'
import { FilteredImage } from './FilteredImage'
import { MediaLoader } from './MediaLoader'

type ModalContentProps = {
    attributes: Attributes
    setAttributes: (attributes: Attributes) => void
    setImage: (image: ImageData, filterName: string) => void
    setInfoMessage: (message: string) => void
    clientId?: string
}

export const ModalContent = memo(function ModalContent({
    attributes,
    setAttributes,
    setImage,
    setInfoMessage,
}: ModalContentProps) {
    const sourceImageId = attributes?.imageFilters?.sourceImageId
    const filteredFromImageId = attributes?.imageFilters?.filteredFromImageId
    const wpImage = useWpImage(filteredFromImageId ?? sourceImageId)
    const [needsImage, setNeedsImage] = useState(false)
    const [generated, setGenerated] = useState<string[]>([])
    const [importing, setImporting] = useState(false)
    const openMediaRef = useRef<HTMLButtonElement>(null)
    const isMounted = useIsMounted()

    const setLoaded = useCallback(() => {
        const filtersV = Object.values(filtersList)
        if (!isMounted || importing) return
        setGenerated((generated) => {
            if (filtersV.length === generated.length) return generated
            const nextFilter = filtersV[generated?.length]
            return [...generated, nextFilter]
        })
    }, [isMounted, importing])

    useLayoutEffect(() => {
        setNeedsImage(!wpImage?.source_url)
    }, [wpImage])

    useEffect(() => {
        if (!wpImage?.source_url) return
        // Set the first one to start generating
        setGenerated([Object.values(filtersList)[0]])
    }, [wpImage])

    useEffect(() => {
        if (!wpImage?.source_url) return
        setInfoMessage(getInfoMessage(generated.length))
    }, [generated, setInfoMessage, wpImage])

    useEffect(() => {
        if (openMediaRef.current) {
            openMediaRef.current.focus()
        }
    }, [needsImage])

    if (needsImage) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <MediaLoader
                    attributes={attributes}
                    setAttributes={setAttributes}
                    openMediaRef={openMediaRef}
                />
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
                            setLoaded={setLoaded}
                            importing={importing}
                            currentFilter={
                                attributes?.imageFilters?.currentFilterSlug ??
                                ''
                            }
                            setImage={(imageData, name) => {
                                if (importing) return
                                setImporting(true)
                                setImage(imageData, name)
                            }}
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
    if (loaded === Object.keys(filtersList).length) return ''
    return sprintf(
        __('Generating %1$s of %2$s filters...', 'image-filters'),
        loaded,
        Object.keys(filtersList).length,
    )
}
