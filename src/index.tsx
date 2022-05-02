import {
    InnerBlocks,
    useBlockProps as blockProps,
} from '@wordpress/block-editor'
import { registerBlockType } from '@wordpress/blocks'
import { __ } from '@wordpress/i18n'
import blockConfig from './block.json'
import { ImageContainer } from './editor/ImageContainer'
import { ModalLoader } from './editor/ModalLoader'
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
                <ModalLoader
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
                    <ImageContainer
                        clientId={clientId}
                        attributes={attributes}
                        setAttributes={setAttributes}>
                        <InnerBlocks
                            template={[['core/image', {}]]}
                            allowedBlocks={['core/image']}
                            // templateLock="all"
                        />
                    </ImageContainer>
                </div>
            </>
        )
    },
    save: () => {
        return <InnerBlocks.Content />
    },
})
