import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { Attributes } from '../types'

type MediaLoaderProps = {
    attributes: Attributes
    setAttributes: (attributes: Attributes) => void
    openMediaRef: React.Ref<HTMLButtonElement>
}
export const MediaLoader = ({
    attributes,
    setAttributes,
    openMediaRef,
}: MediaLoaderProps) => {
    return (
        <div className="flex flex-col items-center">
            <p className="text-xl font-medium m-0 mb-4">
                {__('Hi! Welcome to Image Filters.', 'image-filters')}
            </p>
            <p className="m-0 mb-4 text-base max-w-md text-center">
                {__(
                    'Before getting started, please press the button below to select an image from your media library.',
                    'image-filters',
                )}
            </p>
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={(media) => {
                        setAttributes({
                            ...attributes,
                            ...{
                                alt: media?.alt,
                                caption: media?.caption,
                                id: media?.id,
                                link: media?.link,
                                linkDestination: media?.linkDestination,
                                sizeSlug: media?.sizeSlug,
                                url: media?.url,
                            },
                        })
                    }}
                    allowedTypes={['image']}
                    title={__('Select an image to filter', 'image-filters')}
                    render={({ open }) => (
                        <button
                            ref={openMediaRef}
                            className="bg-gray-900 p-2 px-4 font-bold text-sm text-white cursor-pointer ring-offset-2 ring-gray-900 ring-offset-white focus:ring-4 outline-none shadow-none"
                            type="button"
                            onClick={open}>
                            {__('Open Media Library', 'image-filters')}
                        </button>
                    )}
                />
            </MediaUploadCheck>
        </div>
    )
}
