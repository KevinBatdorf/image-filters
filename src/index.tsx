import {
    InnerBlocks,
    useBlockProps as blockProps,
} from '@wordpress/block-editor'
import { registerBlockType } from '@wordpress/blocks'
import { addFilter } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import blockConfig from './block.json'
import { BlockFilter } from './editor/BlockFilter'
import { Loader } from './editor/Loader'
import { SideControls } from './editor/SideControls'
import { blockIcon } from './icons'
import { Attributes } from './types'

registerBlockType<Attributes>('kevinbatdorf/image-filters', {
    ...blockConfig,
    icon: blockIcon,
    attributes: {
        sourceImageId: { type: 'number' },
        currentImageId: { type: 'number' },
        currentFilterSlug: { type: 'string' },
        filteredFromImageId: { type: 'number' },
    },
    title: __('Image Filters', 'image-filters'),
    edit: ({ attributes, setAttributes, clientId }) => {
        return (
            <>
                <Loader
                    attributes={attributes}
                    clientId={clientId}
                    setAttributes={setAttributes}
                />
                <SideControls
                    attributes={attributes}
                    clientId={clientId}
                    setAttributes={setAttributes}
                />
                <div {...blockProps()}>
                    <InnerBlocks
                        template={[['core/image', {}]]}
                        allowedBlocks={['core/image']}
                        // templateLock="all"
                    />
                </div>
            </>
        )
    },
    save: () => {
        return <InnerBlocks.Content />
    },
})

// Add to the core image block
addFilter('editor.BlockEdit', blockConfig.name, (CurrentMenuItems) =>
    // Not sure how to type these incoming props
    // eslint-disable-next-line
    (props: any) => (
        <BlockFilter {...props} CurrentMenuItems={CurrentMenuItems} />
    ),
)
// Add our attributes
addFilter('blocks.registerBlockType', blockConfig.name, (settings) => {
    if (settings.name !== 'core/image') return settings

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            imageFilters: {
                sourceImageId: { type: 'number' },
                currentImageId: { type: 'number' },
                currentFilterSlug: { type: 'string' },
                filteredFromImageId: { type: 'number' },
            },
        },
    }
})
