import { BlockControls } from '@wordpress/block-editor'
import { ToolbarGroup, ToolbarButton } from '@wordpress/components'

export const ToolbarControls = ({
    openFilters,
}: {
    openFilters: () => void
}) => {
    return (
        <BlockControls>
            <ToolbarGroup>
                <ToolbarButton
                    icon={() => 'View filters'}
                    label="Press to see available filters"
                    onClick={openFilters}
                />
            </ToolbarGroup>
        </BlockControls>
    )
}
