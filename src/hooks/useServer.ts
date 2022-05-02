import { useEffect, useState, useCallback } from '@wordpress/element'
import init, {
    open_image,
    filter,
    to_image_data,
    putImageData,
    get_image_data,
} from '../../pkg/index.js'
import { PhotonImage } from '../types.js'

export interface Server {
    open_image: (
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
    ) => PhotonImage
    to_image_data: (img: PhotonImage) => ImageData
    putImageData: (
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        new_Image: PhotonImage,
    ) => void
    get_image_data: (
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
    ) => ImageData
    filter: (img: PhotonImage, filter: string) => PhotonImage
}

export const useServer = () => {
    const [server, setServer] = useState<Server | null>(null)
    const fetchWasmCode = useCallback(async () => {
        await init()
        setServer({
            open_image,
            to_image_data,
            putImageData,
            get_image_data,
            filter,
        })
    }, [])

    useEffect(() => {
        fetchWasmCode()
    }, [fetchWasmCode])

    return server
}
