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
    const { sourceImageId, filteredFromImageId } = attributes

    const sourceImage: WpImage = useSelect(
        (select) =>
            select('core')?.getMedia(filteredFromImageId ?? sourceImageId),
        [filteredFromImageId, sourceImageId],
    )

    return (
        <InspectorControls>
            <PanelBody title={__('Details', 'image-filters')}>
                <BaseControl id="image-filter-sources">
                    <div className="image-filters-editor">
                        {sourceImage?.source_url ? (
                            <div className="bg-gray-200 mb-4">
                                <img
                                    className="block"
                                    alt="Original"
                                    src={sourceImage?.source_url}
                                />
                            </div>
                        ) : (
                            <p className="text-xs text-gray-900 mb-2">
                                {__(
                                    'No image found. Set an image first before applying filters.',
                                    'image-filters',
                                )}
                            </p>
                        )}

                        <div className="bg-yellow-100 p-2">
                            {__(
                                'Tip: The image filter block is now optional. Press the image filters icon while on a Gutenberg core image block to access filters there.',
                                'image-filters',
                            )}
                        </div>
                    </div>
                </BaseControl>
            </PanelBody>
        </InspectorControls>
    )
}
