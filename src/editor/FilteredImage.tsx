import {
    useRef,
    useEffect,
    useState,
    memo,
    useMemo,
    useCallback,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { motion } from 'framer-motion'
import filtersList from '../filters.json'
import { useFilteredImages } from '../hooks/useFilteredImages'

type FilteredImageProps = {
    name: string
    currentFilter: string
    sourceUrl: string
    importing: boolean
    setLoaded: () => void
    setImage: (image: ImageData, filterName: string) => void
}
export const FilteredImage = memo(function FilteredImage({
    name,
    currentFilter,
    setLoaded,
    sourceUrl,
    setImage,
    importing: busy,
}: FilteredImageProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [importing, setImporting] = useState(false)
    const theFilters: Record<string, string> = filtersList
    const thisOneIsCurrent = name === theFilters[String(currentFilter)]
    const thisOneIsFirst = name === Object.values(theFilters)[0]
    const once = useRef(false)
    const filtersByValue = useMemo(() => {
        return Object.fromEntries(
            Object.entries(filtersList).map((i) => i.reverse()),
        )
    }, [])
    const { filteredImageData: imageData } = useFilteredImages(
        `${sourceUrl}?filters=${name}`,
        name,
        filtersByValue[name as keyof typeof filtersByValue],
    )

    const handleClick = useCallback(() => {
        if (importing || !imageData || busy) return
        setImporting(true)
        setImage(imageData, name)
    }, [importing, imageData, name, setImage, busy])

    useEffect(() => {
        if (imageData?.data?.length && !once.current) {
            once.current = true
            // Without this the window locks in mid animation
            const raf = requestAnimationFrame(setLoaded)
            return () => cancelAnimationFrame(raf)
        }
    }, [imageData, setLoaded, name])

    useEffect(() => {
        if (!buttonRef.current) return
        if (thisOneIsFirst) {
            buttonRef.current.focus()
        }
    }, [currentFilter, thisOneIsFirst, imageData])

    useEffect(() => {
        if (!canvasRef.current || !imageData) return
        canvasRef.current.width = imageData.width
        canvasRef.current.height = imageData.height
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) {
            ctx.putImageData(
                imageData,
                0,
                0,
                0,
                0,
                imageData.width,
                imageData.height,
            )
        }
    }, [imageData])

    if (!imageData?.data?.length) {
        return null
    }

    if (busy && !once.current) {
        // This stops additional rendering if the user presses to import
        return null
    }

    return (
        <motion.div
            layout
            className="w-full"
            initial={{ opacity: 0.0 }}
            transition={{ opacity: { duration: 0.2 } }}
            animate={{ opacity: 1 }}>
            <button
                ref={buttonRef}
                style={{ aspectRatio: imageData.width / imageData.height + '' }}
                className="group w-full bg-gray-100 m-0 p-0 flex items-end relative border cursor-pointer ring-offset-2 ring-gray-900 ring-offset-white focus:ring-4 outline-none shadow-none"
                onClick={handleClick}>
                <div className="absolute flex inset-0 items-end z-10">
                    <p className="text-xs m-0 p-2 py-0.5 bg-gray-900 text-gray-300 flex space-x-1">
                        <span>{name}</span>
                        <span>
                            {thisOneIsCurrent &&
                                __('(currently selected)', 'image-filters')}
                        </span>
                    </p>
                </div>
                <canvas className="max-w-full block" ref={canvasRef}></canvas>
                <div
                    style={{
                        background: 'radial-gradient(#ffffffd1, #ffffff00)',
                    }}
                    className={classnames(
                        'absolute flex inset-0 items-center justify-center z-40 bg-opacity-80 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out',
                        {
                            'opacity-80': importing,
                        },
                    )}>
                    <span className="bg-gray-900 p-2 px-4 font-bold text-sm text-white">
                        {importing
                            ? __('Importing...', 'image-filters')
                            : __('Press to import', 'image-filters')}
                    </span>
                </div>
            </button>
        </motion.div>
    )
})
