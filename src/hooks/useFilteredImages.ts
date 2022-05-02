import { useEffect, useState } from '@wordpress/element'
import useSWRImmutable from 'swr/immutable'
import { useServer } from '../hooks/useServer'
import { processImages } from '../lib/processImages'
import { useCanvas } from './useCanvas'

export const useFilteredImages = (
    url: string,
    filterName: string,
    filterSlug: string,
): {
    filteredImageData: ImageData | undefined
    isLoading: boolean
    errorMsg: string
} => {
    const server = useServer()
    const [ready, setReady] = useState(false)
    const { canvas, ctx, img, isLoading: canvasLoading } = useCanvas(url)
    const getImages = () => {
        if (!server || !url || !canvas || !ctx || !img) return
        console.log(`Processing filter [${filterName}]`)
        return processImages(filterSlug, server, canvas, ctx, img)
    }
    const { data, error } = useSWRImmutable(ready ? url : null, getImages)

    useEffect(() => {
        if (server && !canvasLoading) setReady(true)
    }, [server, canvasLoading])

    return {
        filteredImageData: data,
        isLoading: !data && !error,
        errorMsg: error?.toString(),
    }
}
