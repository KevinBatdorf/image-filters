import { useEffect, useState, useRef } from '@wordpress/element'
import { loadImage } from '../lib/processImages'

export const useCanvas = (imageUrl: string) => {
    const [img, setImg] = useState<HTMLImageElement>()
    const canvas = useRef<HTMLCanvasElement>()
    const ctx = useRef<CanvasRenderingContext2D>()

    useEffect(() => {
        const img = new Image()
        img.src = imageUrl
        loadImage(img).then(() => {
            setImg(img)
        })
    }, [imageUrl])

    useEffect(() => {
        if (!img) return
        const c = document.createElement('canvas')
        c.width = img.width
        c.height = img.height
        canvas.current = c
        return () => c.remove()
    }, [img])

    useEffect(() => {
        if (!canvas?.current || !img) return
        const c = canvas?.current?.getContext('2d') ?? undefined
        ctx.current = c
    }, [canvas, img])

    return {
        canvas: canvas.current,
        ctx: ctx.current,
        img,
        isLoading: !canvas.current || !ctx.current || !img,
    }
}
