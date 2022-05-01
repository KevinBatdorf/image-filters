import { useEffect, useRef } from '@wordpress/element'
import filtersList from '../filters.json'
import { useFilteredImages } from '../hooks/useFilteredImages'
import { Attributes } from '../types'
import { FilteredImage } from './FilteredImage'

type PageLoaderProps = {
    filters: [string, string][]
    sourceUrl: string
    attributes: Attributes
    setImage: (image: ImageData, filterName: string) => void
    setLoaded: () => void
}
export const PageLoader = ({
    filters,
    setImage,
    setLoaded,
    sourceUrl,
    attributes,
}: PageLoaderProps) => {
    const once = useRef(false)
    const theFilters: Record<string, string> = filtersList
    const { filteredImageData, isLoading, errorMsg } = useFilteredImages(
        `${sourceUrl}?filters=${filters.toString()}`,
        Object.fromEntries(filters),
    )
    if (errorMsg) {
        console.error(errorMsg)
    }
    useEffect(() => {
        if (!isLoading && !once.current) {
            once.current = true
            const id = setTimeout(() => {
                setLoaded()
            }, 200)
            return () => clearTimeout(id)
        }
    }, [filteredImageData, setLoaded, isLoading])

    if (!filteredImageData) {
        return null
    }
    return (
        <>
            {Object.entries(filteredImageData).map(([name, imageData]) => (
                <FilteredImage
                    key={name}
                    current={
                        attributes.currentFilterSlug
                            ? name ===
                              theFilters[String(attributes.currentFilterSlug)]
                            : false
                    }
                    imageData={imageData}
                    setImage={setImage}
                    name={name}
                />
            ))}
        </>
    )
}
