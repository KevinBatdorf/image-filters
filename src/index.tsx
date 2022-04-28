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

registerBlockType<Attributes>('kevinbatdorf/image-filters-block', {
    ...blockConfig,
    icon: blockIcon,
    attributes: {
        originalImageId: { type: 'number' },
        currentImageId: { type: 'number' },
    },
    title: __('Image Filters', 'image-filters-block'),
    edit: ({ attributes, setAttributes, clientId }) => {
        // TODO: bring in something to manage state better?
        // If they have an image set, but not a filter (or they are identical), then preemptively
        // render all the filters:
        //   Do we cache the filters? in memory only?
        //   Do we warn if the image is too large?

        // Full loop over filters here with a single object
        // into array of imageData objects

        // how to accept and persist data
        // After that, get the image info and create a new image block
        // by cloning the existing one
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
                            templateLock="all"
                        />
                    </ImageContainer>
                </div>
            </>
        )
    },
    save: () => {
        return (
            <div {...blockProps.save()}>
                <InnerBlocks.Content />
            </div>
        )
    },
})
