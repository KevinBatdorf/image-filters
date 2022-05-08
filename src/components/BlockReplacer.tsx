import { store as blockEditorStore } from '@wordpress/block-editor'
import { createBlock } from '@wordpress/blocks'
import { useSelect, useDispatch } from '@wordpress/data'
import { useEffect } from '@wordpress/element'
import { AttributesDeprecated } from '../types'

export const BlockReplacer = ({
    clientId,
    attributes: imageFilters,
}: {
    clientId: string
    attributes: AttributesDeprecated
}) => {
    const block = useSelect(
        (select) =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore-next-line - replaceBlock not added as a type?
            select(blockEditorStore).getBlock(clientId ?? ''),
        [clientId],
    )
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line - replaceBlock not added as a type?
    const { replaceBlock } = useDispatch(blockEditorStore)
    useEffect(() => {
        if (!block?.name || !replaceBlock || !clientId) return
        if (block.innerBlocks[0]) {
            const attributes = Object.assign(
                {},
                block.innerBlocks[0].attributes,
                {
                    // There's a chancge our attributes were filtered by another plugin
                    // so better to be explicit here
                    imageFilters: {
                        sourceImageId: imageFilters?.sourceImageId,
                        filteredFromImageId: imageFilters?.filteredFromImageId,
                        currentImageId: imageFilters?.currentImageId,
                        currentFilterSlug: imageFilters?.currentFilterSlug,
                    },
                },
            )
            replaceBlock(clientId, [createBlock('core/image', attributes)])
            return
        }
        const blockData = createBlock('core/image')
        replaceBlock(clientId, [blockData]).then(() => {
            const { clientId } = blockData
            // Open the modal if they insert the block
            window.dispatchEvent(
                new CustomEvent('kevinbatdorf/open-image-filters', {
                    bubbles: true,
                    detail: { clientId },
                }),
            )
        })
    }, [block, replaceBlock, clientId, imageFilters])

    return <></>
}
