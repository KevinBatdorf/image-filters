import { useEffect, useState } from '@wordpress/element'
import { sprintf, __ } from '@wordpress/i18n'
import { AnimatePresence, motion } from 'framer-motion'
import filters from '../filters.json'
import { useWpImage } from '../hooks/useWpImage'
import { batch } from '../lib/utils'
import { Attributes } from '../types'
import { PageLoader } from './PageLoader'

type ModalContentProps = {
    attributes: Attributes
    setImage: (image: ImageData) => void
    clientId?: string
}

export const ModalContent = ({ attributes, setImage }: ModalContentProps) => {
    const { originalImageId } = attributes
    const wpImage = useWpImage(originalImageId)
    const batches = batch(filters, 1)
    const [loaded, setLoaded] = useState(0)
    const [loadedFilters, setLoadedFilters] = useState<[string, string][][]>()

    useEffect(() => {
        if (!batches.length) return
        let raf = 0
        if (!loadedFilters || loadedFilters.length < loaded + 1) {
            raf = requestAnimationFrame(() => {
                // TODO: Check if still mounted
                setLoadedFilters(batches.slice(0, loaded + 1))
            })
        }
        return () => cancelAnimationFrame(raf)
    }, [loaded, batches, loadedFilters])

    if (!wpImage?.source_url) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p className="m-0 p-0 text-md font-bold">
                    {__(
                        'No image found. Set an image first before applying filters.',
                        'image-filters-block',
                    )}
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-y-scroll h-full flex flex-col items-center">
            <AnimatePresence>
                {loaded < batches.length && (
                    <motion.div
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ opacity: { duration: 0.5 } }}
                        className="bg-white flex justify-start w-full p-2 shadow-lg absolute bottom-0 z-40 border-t border-gray-100">
                        <p className="m-0 p-0 text-md font-bold">
                            {sprintf(
                                __(
                                    'Generating %1$s of %2$s filters...',
                                    'image-filters-block',
                                ),
                                loaded + 1,
                                Object.keys(filters).length,
                            )}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="grid w-full grid-cols-4 gap-4 p-4 bg-gray-50">
                {loadedFilters?.map((batch) => (
                    <PageLoader
                        key={batch.toString()}
                        setLoaded={() => setLoaded((loaded) => loaded + 1)}
                        sourceUrl={wpImage.source_url}
                        filters={batch}
                        setImage={setImage}
                    />
                ))}
                {Object.keys(filters)
                    .slice(loaded)
                    .map((_, i, all) => {
                        const opacity =
                            all.length / (Math.max(i, all.length / 2) + 1) - 1
                        const aspectRatio =
                            wpImage?.media_details?.width /
                                wpImage?.media_details?.height +
                            ''
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
}
