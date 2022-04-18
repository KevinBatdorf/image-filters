import { useState } from '@wordpress/element'
import type { Attributes } from '../types'
import { Modal } from './Modal'
import { ToolbarControls } from './ToolbarControls'

type ModalLoaderProps = {
    attributes: Attributes
    setAttributes: (attributes: Attributes) => void
    clientId?: string
}

export const ModalLoader = ({
    attributes,
    setAttributes,
    clientId,
}: ModalLoaderProps) => {
    const [showFilters, setShowFilters] = useState(true)
    return (
        <>
            <ToolbarControls openFilters={() => setShowFilters(true)} />
            <Modal
                attributes={attributes}
                clientId={clientId}
                setAttributes={setAttributes}
                open={showFilters}
                onClose={() => setShowFilters(false)}
            />
        </>
    )
}
