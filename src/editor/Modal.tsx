import { useRef } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Attributes } from '../types'
import { ModalContent } from './ModalContent'
import { ModalToolbar } from './ModalToolbar'

type ModalProps = {
    open: boolean
    attributes: Attributes
    setImage: (image: ImageData, filterName: string) => void
    setAttributes: (attributes: Attributes) => void
    clientId?: string
    onClose: () => void
}

export const Modal = ({
    open,
    onClose,
    attributes,
    setImage,
    clientId,
}: ModalProps) => {
    const intialFocus = useRef(null)

    return (
        <AnimatePresence>
            {open && (
                <Dialog
                    className="image-filters-block-editor ifb-modal"
                    static
                    initialFocus={intialFocus}
                    as={motion.div}
                    key="modal"
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    open={open}
                    onClose={onClose}>
                    <div className="absolute mx-auto w-full h-full p-8 lg:p-24">
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
                        <motion.div
                            key="modal"
                            initial={{ y: 30 }}
                            animate={{ y: 0 }}
                            exit={{ y: 0, opacity: 0 }}
                            className="flex flex-col bg-gray-50 h-full w-full relative rounded-md shadow-lg overflow-hidden">
                            <ModalToolbar
                                onClose={onClose}
                                title={__(
                                    'Select a filter',
                                    'image-filters-block',
                                )}
                            />
                            <ModalContent
                                attributes={attributes}
                                setImage={setImage}
                                clientId={clientId}
                            />
                        </motion.div>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    )
}
