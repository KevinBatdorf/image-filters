import { useRef, useEffect } from '@wordpress/element'
import { motion } from 'framer-motion'

type FilteredImageProps = {
    name: string
    imageData: ImageData
    setImage: (image: ImageData) => void
}
export const FilteredImage = ({
    name,
    imageData,
    setImage,
}: FilteredImageProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const handleClick = () => setImage(imageData)

    useEffect(() => {
        if (!canvasRef.current) return
        canvasRef.current.width = imageData.width
        canvasRef.current.height = imageData.height
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) {
            console.log('ctx', { ctx, imageData })
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
        <button
            ref={buttonRef}
            style={{ aspectRatio: imageData.width / imageData.height + '' }}
            className="ww-full overflow-hidden bg-gray-100 m-0 p-0 flex items-end relative"
            onClick={handleClick}>
            <p className="absolute text-xs m-0 p-2 py-1 bg-gray-900 text-gray-300">
                {name}
            </p>
            <motion.span
                layout
                className="w-full"
                initial={{ opacity: 0.0 }}
                transition={{ opacity: { duration: 0.2 } }}
                animate={{ opacity: 1 }}>
                <canvas className="max-w-full block" ref={canvasRef}></canvas>
            </motion.span>
        </button>
    )
}
