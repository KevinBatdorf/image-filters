import { useEffect, useState } from '@wordpress/element'
import { loadImage } from '../lib/processImages'

export const useCanvas = (imageUrl: string) => {
    const [img, setImg] = useState<HTMLImageElement>()
    const [canvas, setCanvas] = useState<HTMLCanvasElement>()
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

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
        setCanvas(c)
        return () => c.remove()
    }, [img])

    useEffect(() => {
        if (!canvas || !img) return
        const c = canvas?.getContext('2d') ?? undefined
        setCtx(c)
    }, [canvas, img])

    return {
        canvas,
        ctx,
        img,
        isLoading: !canvas || !ctx || !img,
    }
}
