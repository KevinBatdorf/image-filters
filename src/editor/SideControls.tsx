import { InspectorControls } from '@wordpress/block-editor'
import { PanelBody, BaseControl } from '@wordpress/components'
import { useSelect } from '@wordpress/data'
import { __ } from '@wordpress/i18n'
import type { Attributes, WpImage } from '../types'

type ControlProps = {
    attributes: Attributes
    setAttributes: (attributes: Attributes) => void
    clientId?: string
}

export const SideControls = ({ attributes }: ControlProps) => {
    const { originalImageId, currentImageId } = attributes
    const originalImage: WpImage = useSelect((s) =>
        s('core')?.getMedia(originalImageId),
    )
    const currentImage: WpImage = useSelect((s) =>
        s('core')?.getMedia(currentImageId),
    )
    const hasUpdatedImage = originalImageId !== currentImageId

    return (
        <InspectorControls>
            <PanelBody title={__('Details', 'image-filters-block')}>
                <BaseControl id="image-filter-sources">
                    <div className="image-filters-block-editor">
                        {originalImage?.source_url ? (
                            <>
                                <p className="text-xs text-gray-900 mb-2">
                                    {__('Original', 'image-filters-block')}
                                </p>
                                <div className="bg-gray-200 mb-4">
                                    <img
                                        className="block"
                                        alt="Original"
                                        src={originalImage?.source_url}
                                    />
                                </div>
                            </>
                        ) : (
                            <p className="text-xs text-gray-900 mb-2">
                                {__(
                                    'No image found. Set an image first before applying filters.',
                                    'image-filters-block',
                                )}
                            </p>
                        )}
                        {/* TODO: If updated, show revert button */}
                    </div>
                </BaseControl>
            </PanelBody>
        </InspectorControls>
    )
}
