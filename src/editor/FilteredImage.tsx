import { useRef, useEffect, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import filtersList from '../filters.json'

type FilteredImageProps = {
    name: string
    imageData: ImageData
    current: string
    setImage: (image: ImageData, filterName: string) => void
}
export const FilteredImage = ({
    name,
    imageData,
    setImage,
    current,
}: FilteredImageProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [importing, setImporting] = useState(false)
    const theFilters: Record<string, string> = filtersList
    const thisOneIsCurrent = name === theFilters[String(current)]
    const thisOneIsFirst = name === Object.values(theFilters)[0]
    const handleClick = () => {
        if (importing) return
        setImporting(true)
        setImage(imageData, name)
    }

    useEffect(() => {
        if (!buttonRef.current) return
        if (thisOneIsFirst) {
            buttonRef.current.focus()
        }
    }, [current, thisOneIsFirst])

    useEffect(() => {
        if (!canvasRef.current) return
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

    if (!imageData.data.length) {
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
                className={classNames(
                    'group w-full bg-gray-100 m-0 p-0 flex items-end relative border cursor-pointer ring-offset-2 ring-black ring-offset-white focus:ring-4 outline-none shadow-none',
                    { 'ring-4': thisOneIsCurrent },
                )}
                onClick={handleClick}>
                <div className="absolute flex inset-0 items-end z-10">
                    <p className="text-xs m-0 p-2 py-0.5 bg-gray-900 text-gray-300">
                        {name}
                    </p>
                </div>
                <canvas className="max-w-full block" ref={canvasRef}></canvas>
                <div className="absolute bg-white flex inset-0 items-center justify-center z-40 opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out">
                    <span className="bg-black p-2 px-4 font-bold text-sm text-white">
                        {importing
                            ? __('Importing...', 'image-filters')
                            : __('Press to import', 'image-filters')}
                    </span>
                </div>
            </button>
        </motion.div>
    )
}
