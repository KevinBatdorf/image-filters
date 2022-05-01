import apiFetch from '@wordpress/api-fetch'
import type { Server } from '../hooks/useServer'
import { WpImage } from '../types'

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

export const uploadImage = async (
    image: ImageData,
    imageToClone: WpImage,
): Promise<WpImage | undefined> => {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.putImageData(image, 0, 0)
    const blob: Blob = await new Promise((resolve) => {
        canvas.toBlob((blob) => {
            blob && resolve(blob)
        }, imageToClone.mime_type)
    })

    const formData = new FormData()
    formData.append('file', new File([blob], imageToClone.media_details.file))
    formData.append('alt_text', imageToClone?.alt_text ?? '')
    formData.append('caption', imageToClone?.caption?.raw ?? '')
    formData.append('description', imageToClone?.description?.raw ?? '')

    // inherit isn't a valid status
    const status = ['publish', 'future', 'draft', 'pending', 'private'].find(
        (v) => v === imageToClone.status,
    )
    if (status) formData.append('status', status)

    return await apiFetch({
        path: 'wp/v2/media',
        method: 'POST',
        body: formData,
    })
}
