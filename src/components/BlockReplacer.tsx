import { store as blockEditorStore } from '@wordpress/block-editor'
import { createBlock } from '@wordpress/blocks'
import { useSelect, useDispatch } from '@wordpress/data'
import { useEffect } from '@wordpress/element'

export const BlockReplacer = ({ clientId }: { clientId: string }) => {
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
            replaceBlock(clientId, [block.innerBlocks[0]])
            return
        }
        const blockData = createBlock('core/image')
        replaceBlock(clientId, [blockData]).then(() => {
            const { clientId } = blockData
            window.dispatchEvent(
                new CustomEvent('kevinbatdorf/open-image-filters', {
                    bubbles: true,
                    detail: { clientId },
                }),
            )
        })
    }, [block, replaceBlock, clientId])

    return <></>
}
