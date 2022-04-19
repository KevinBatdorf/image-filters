import { useRef } from '@wordpress/element'
import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Attributes } from '../types'
import { ModalContent } from './ModalContent'
import { ModalToolbar } from './ModalToolbar'

type ModalProps = {
    open: boolean
    attributes: Attributes
    setAttributes: (attributes: Attributes) => void
    clientId?: string
    onClose: () => void
}

export const Modal = ({
    open,
    onClose,
    attributes,
    clientId,
    setAttributes,
}: ModalProps) => {
    const intialFocus = useRef(null)
    const setImage = (image: ImageData) => {
        console.log(image)
    }
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
                    onClose={() => ({})}>
                    <div className="absolute mx-auto w-full h-full p-24">
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
                        <motion.div
                            key="modal"
                            initial={{ y: 30 }}
                            animate={{ y: 0 }}
                            exit={{ y: 0, opacity: 0 }}
                            className="flex flex-col bg-gray-50 h-full w-full relative rounded-md shadow-lg overflow-hidden">
                            <ModalToolbar onClose={onClose} />
                            <ModalContent
                                attributes={attributes}
                                clientId={clientId}
                                setImage={setImage}
                            />
                        </motion.div>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    )
}
