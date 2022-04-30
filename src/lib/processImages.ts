import type { Server } from '../hooks/useServer'

export const loadImage = (img: HTMLImageElement) => {
    return new Promise((resolve) => (img.onload = resolve))
}

export const processImages = (
    filters: Record<string, string>,
    server: Server,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
) => {
    const filteredImages = new Map()
    for (const [filter, name] of Object.entries(filters)) {
        ctx.drawImage(img, 0, 0)
        const photonImage = server.open_image(canvas, ctx)
        server.filter(photonImage, filter)
        server.putImageData(canvas, ctx, photonImage)
        const imageData = server.get_image_data(canvas, ctx)
        filteredImages.set(name, imageData)
    }
    return Object.fromEntries(filteredImages)
}
