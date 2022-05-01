import { store as blockEditorStore } from '@wordpress/block-editor'
import { useSelect } from '@wordpress/data'
import {
    useEffect,
    useState,
    useLayoutEffect,
    useMemo,
    memo,
} from '@wordpress/element'
import { sprintf, __ } from '@wordpress/i18n'
import { motion } from 'framer-motion'
import filters from '../filters.json'
import { useIsMounted } from '../hooks/useIsMounted'
import { useWpImage } from '../hooks/useWpImage'
import { batch } from '../lib/utils'
import { Attributes } from '../types'
import { PageLoader } from './PageLoader'

type ModalContentProps = {
    attributes: Attributes
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
    const batches = useMemo(() => batch(filters, 1), [])
    const [loaded, setLoaded] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')
    const [loadedFilters, setLoadedFilters] = useState<[string, string][][]>()
    const isMounted = useIsMounted()
    const block = useSelect((select) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line - replaceBlock not added as a type?
        return select(blockEditorStore).getBlock(clientId ?? '')
    })

    useEffect(() => {
        if (!batches.length) return
        let raf = 0
        if (!loadedFilters || loadedFilters.length < loaded + 1) {
            raf = requestAnimationFrame(() => {
                if (!isMounted) return
                setLoadedFilters(batches.slice(0, loaded + 1))
                setInfoMessage(getInfoMessage(loaded, batches))
            })
            return () => {
                cancelAnimationFrame(raf)
            }
        }
    }, [loaded, batches, loadedFilters, isMounted, setInfoMessage])

    useEffect(() => {
        const id = setTimeout(() => {
            if (!isMounted || loaded >= batches.length) return
            setInfoMessage(
                __(
                    'Filter generating stuck? Try closing and reopening the modal.',
                    'image-filters',
                ),
            )
        }, 25_000)
        return () => clearTimeout(id)
    }, [loadedFilters, isMounted, loaded, batches.length, setInfoMessage])

    useLayoutEffect(() => {
        if (block && !block?.innerBlocks[0]) {
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
    }, [wpImage, block])

    if (errorMessage) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p className="m-0 p-0 text-md font-bold">{errorMessage}</p>
            </div>
        )
    }

    return (
        <div className="overflow-y-scroll h-full flex flex-col items-center">
            <div className="grid w-full grid-cols-4 gap-4 p-4 bg-gray-50">
                {loadedFilters?.map((batch) => (
                    <PageLoader
                        key={batch.toString()}
                        setLoaded={() => setLoaded((loaded) => loaded + 1)}
                        sourceUrl={wpImage?.source_url ?? ''}
                        attributes={attributes}
                        filters={batch}
                        setImage={setImage}
                    />
                ))}
                {Object.keys(filters)
                    .slice(loaded)
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
                            <motion.div
                                layout
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

const getInfoMessage = (loaded: number, batches: [string, string][][]) => {
    if (loaded >= batches.length) {
        return ''
    }
    return sprintf(
        __('Generating %1$s of %2$s filters...', 'image-filters'),
        loaded + 1,
        Object.keys(filters).length,
    )
}
