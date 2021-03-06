import { BlockControls } from '@wordpress/block-editor'
import { ToolbarGroup, ToolbarButton } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { blockIcon } from '../icons'

// I'm unsure how to type the incoming types from the filter fn
export type ToolbarControlsProps = {
    openFilters: () => void
    // eslint-disable-next-line
    CurrentMenuItems?: React.ComponentType
    // eslint-disable-next-line
    toolbarProps: any
    clientId?: string
}
export const ToolbarControls = (props: ToolbarControlsProps) => {
    const { CurrentMenuItems, openFilters, toolbarProps } = props
    return (
        <>
            {CurrentMenuItems && <CurrentMenuItems {...toolbarProps} />}
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon={blockIcon}
                        label={__(
                            'Press to see available filters',
                            'image-filters',
                        )}
                        onClick={openFilters}
                    />
                </ToolbarGroup>
            </BlockControls>
        </>
    )
}
