import { useSelect } from '@wordpress/data'
import { useState, useEffect } from '@wordpress/element'
import filters from '../filters.json'
import { Attributes, WpImage } from '../types'
import { FilteredImage } from './FilteredImage'

type ModalContentProps = {
    attributes: Attributes
    setImage: (image: ImageData) => void
    clientId?: string
}

export const ModalContent = ({ attributes, setImage }: ModalContentProps) => {
    const { originalImageId } = attributes
    const [sourceUrl, setSourceUrl] = useState('')
    const originalImage: WpImage = useSelect((s) =>
        s('core')?.getMedia(originalImageId),
    )

    useEffect(() => {
        if (originalImage) {
            setSourceUrl(originalImage.source_url)
        }
    }, [originalImage])

    if (!sourceUrl) return <p>Loading..</p>

    return (
        <div className="overflow-y-scroll">
            <div className="grid grid-cols-3 gap-4 p-4">
                {Object.entries(filters).map(([filter, name]) => (
                    <FilteredImage
                        key={name}
                        sourceUrl={sourceUrl}
                        setImage={setImage}
                        name={name}
                        filter={filter}
                    />
                ))}
            </div>
        </div>
    )
}

// TODO:
// - Add revert button on sidebar
// - Add array of available filters and their functions
// - Create component to display filters
// - figure out how to save an image to the media library
// - replace the media in the inner block or just replace the entire block before closing the modal
// - do something if they attempt to see the filters but have no image set
