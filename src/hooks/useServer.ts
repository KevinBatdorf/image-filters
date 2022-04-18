import { useEffect, useState } from '@wordpress/element'
import init, {
    open_image,
    do_something,
    to_image_data,
} from '../../pkg/index.js'

interface Server {
    open_image: any
    do_something: any
    to_image_data: any
}

export const useServer = () => {
    const [server, setServer] = useState<Server | null>(null)
    useEffect(() => {
        const fetchWasmCode = async () => {
            await init()
            setServer({ open_image, do_something, to_image_data })
        }
        fetchWasmCode()
    }, [])
    return server
}
