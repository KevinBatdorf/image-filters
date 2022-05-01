import { useRef, useEffect } from '@wordpress/element'
import classNames from 'classnames'
import { motion } from 'framer-motion'

type FilteredImageProps = {
    name: string
    imageData: ImageData
    current: boolean
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
    const handleClick = () => setImage(imageData, name)

    useEffect(() => {
        if (current && buttonRef.current) {
            buttonRef.current.focus()
        }
    }, [current])

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
                    'w-full bg-gray-100 m-0 p-0 flex items-end relative border cursor-pointer ring-offset-2 ring-wp-theme-500 focus:ring-4',
                    { 'ring-4': current },
                )}
                onClick={handleClick}>
                <div className="absolute flex inset-0 items-end z-10">
                    <p className="text-xs m-0 p-2 py-0.5 bg-gray-900 text-gray-300">
                        {name}
                    </p>
                </div>
                <canvas className="max-w-full block" ref={canvasRef}></canvas>
            </button>
        </motion.div>
    )
}
