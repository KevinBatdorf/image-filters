import { useRef, useEffect, useState, useCallback } from '@wordpress/element'
import { useServer } from '../hooks/useServer'

type FilteredImageProps = {
    name: string
    sourceUrl: string
    filter: string
    setImage: (image: ImageData) => void
}
export const FilteredImage = ({
    name,
    filter,
    sourceUrl,
    setImage,
}: FilteredImageProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const server = useServer()
    const [filteredImage, setFilteredImage] = useState<ImageData>()
    const [aspectRatio, setAspectRatio] = useState('1')

    const handleClick = () => {
        if (!filteredImage) return
        setImage(filteredImage)
    }
    const loadImage = (img: HTMLImageElement) => {
        return new Promise((resolve) => (img.onload = resolve))
    }
    const loadFilteredImage = useCallback(async () => {
        console.log('running')
        const canvas = document.createElement('canvas')
        const img = new Image()
        img.src = sourceUrl
        await loadImage(img)
        setAspectRatio(`${img.width} / ${img.height}`)
        canvas.width = img.width
        canvas.height = img.height
        console.log({ img })
        if (canvasRef.current) {
            canvasRef.current.width = Number(
                buttonRef?.current?.offsetWidth ?? img.width,
            )
            canvasRef.current.height = Number(
                buttonRef?.current?.offsetHeight ?? img.height,
            )
        }
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.drawImage(
                img,
                0,
                0,
                canvasRef?.current?.width ?? 0,
                canvasRef?.current?.height ?? 0,
            )
            const photonImage = server?.open_image(canvas, ctx)
            server?.filter(photonImage, filter)
            setFilteredImage(server?.to_image_data(photonImage))
        }
    }, [filter, sourceUrl, server])

    useEffect(() => {
        // TODO:
        // Check teh placeholder heigth and width
        // add loader and blur placeholder image
        // rearrange filter order
        // if (!server?.filter) return
        // const raf = requestAnimationFrame(() => loadFilteredImage())
        // return () => cancelAnimationFrame(raf)
    }, [loadFilteredImage, server])

    useEffect(() => {
        console.log({ filteredImage })
        if (!filteredImage) return
        if (!canvasRef.current) return
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) {
            ctx.putImageData(filteredImage, 0, 0)
        }
    }, [filteredImage])

    return (
        <button
            ref={buttonRef}
            style={{ aspectRatio, backgroundImage: `url(${sourceUrl})` }}
            className="overflow-hidden bg-cover bg-gray-100 m-0 p-0 flex items-center justify-center relative"
            onClick={handleClick}>
            <p className="absolute text-3xl font-bold p-2 bg-white text-gray-900">
                {name}
            </p>
            <canvas className="max-w-full block" ref={canvasRef}></canvas>
        </button>
    )
}
