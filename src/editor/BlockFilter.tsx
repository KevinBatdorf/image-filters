import { store as blockEditorStore } from '@wordpress/block-editor'
import { useSelect } from '@wordpress/data'
import { Loader } from './Loader'

// eslint-disable-next-line
export const BlockFilter = (props: any) => {
    const { CurrentMenuItems } = props
    const { attributes, setAttributes, clientId } = props
    const showMenu = useSelect(
        (select) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore-next-line - getBlock not added as a type?
            const currentBlock = select(blockEditorStore).getBlock(clientId)
            // only show on core image blocks for now
            if (currentBlock.name !== 'core/image') return false
            const parentId =
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore-next-line - getBlockParents not added as a type?
                select(blockEditorStore).getBlockParents(clientId)
            // If there is no parent, nothing else to check
            if (!parentId?.length) return true
            const parentBlock =
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore-next-line - getBlockParents not added as a type?
                select(blockEditorStore).getBlock(parentId)
            // Only if the parent block is not our main block
            return parentBlock?.name !== 'kevinbatdorf/image-filters'
        },
        [clientId],
    )
    if (!showMenu) {
        return <CurrentMenuItems {...props} />
    }
    return (
        <Loader
            attributes={attributes}
            setAttributes={setAttributes}
            clientId={clientId}
            CurrentMenuItems={CurrentMenuItems}
            toolbarProps={props}
        />
    )
}
