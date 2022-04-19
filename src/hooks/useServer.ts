import { useEffect, useState, useCallback } from '@wordpress/element'
import init, {
    open_image,
    filter,
    to_image_data,
    console_log,
} from '../../pkg/index.js'
import { PhotonImage } from '../types.js'

interface Server {
    open_image: (
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
    ) => PhotonImage
    to_image_data: (img: PhotonImage) => ImageData
    filter: (img: PhotonImage, filter: string) => PhotonImage
    console_log: (string: string) => void
}

export const useServer = () => {
    const [server, setServer] = useState<Server | null>(null)
    const fetchWasmCode = useCallback(async () => {
        await init()
        setServer({
            open_image,
            to_image_data,
            filter,
            console_log,
        })
    }, [])

    useEffect(() => {
        fetchWasmCode()
    }, [fetchWasmCode])

    return server
}
