import { useEffect, useRef } from '@wordpress/element'
import { useFilteredImages } from '../hooks/useFilteredImages'
import { FilteredImage } from './FilteredImage'

type PageLoaderProps = {
    filters: [string, string][]
    sourceUrl: string
    setImage: (image: ImageData) => void
    setLoaded: () => void
}
export const PageLoader = ({
    filters,
    setImage,
    setLoaded,
    sourceUrl,
}: PageLoaderProps) => {
    const { filteredImageData, isLoading, errorMsg } = useFilteredImages(
        `${sourceUrl}?filters=${filters.toString()}`,
        Object.fromEntries(filters),
    )
    const once = useRef(false)
    useEffect(() => {
        if (!isLoading && !once.current) {
            once.current = true
            const id = setTimeout(() => {
                setLoaded()
            }, 200)
            return () => clearTimeout(id)
        }
    }, [filteredImageData, setLoaded, isLoading])

    // console.log({ filteredImageData, isLoading, errorMsg })
    if (!filteredImageData) {
        return null
    }
    return (
        <>
            {Object.entries(filteredImageData).map(([name, imageData]) => (
                <FilteredImage
                    key={name}
                    imageData={imageData}
                    setImage={setImage}
                    name={name}
                />
            ))}
        </>
    )
}
