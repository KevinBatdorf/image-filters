import { InnerBlocks } from '@wordpress/block-editor'
import { registerBlockType } from '@wordpress/blocks'
import { addFilter } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import blockConfig from './block.json'
import { BlockReplacer } from './components/BlockReplacer'
import { BlockFilter } from './editor/BlockFilter'
import './editor/editor.css'
import { blockIcon } from './icons'
import { AttributesDeprecated } from './types'

// This block now will replace itself with an image block and open out modal
// It's essentially a convenience block!
registerBlockType<AttributesDeprecated>('kevinbatdorf/image-filters', {
    ...blockConfig,
    icon: blockIcon,
    attributes: {
        sourceImageId: { type: 'number' },
        currentImageId: { type: 'number' },
        currentFilterSlug: { type: 'string' },
        filteredFromImageId: { type: 'number' },
    },
    title: __('Image Filters', 'image-filters'),
    edit: ({ clientId, attributes }) => (
        <BlockReplacer clientId={clientId} attributes={attributes} />
    ),
    save: () => <InnerBlocks.Content />,
})

// Add to the core image block
addFilter(
    'editor.BlockEdit',
    blockConfig.name,
    (CurrentMenuItems) =>
        // Not sure how to type these incoming props
        // eslint-disable-next-line
        (props: any) =>
            // It seems like Gutenberg wants a top level component here
            BlockFilter(CurrentMenuItems, props),
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
