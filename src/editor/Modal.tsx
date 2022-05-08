import { useRef, useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Attributes } from '../types'
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
    setAttributes,
    setImage,
    clientId,
}: ModalProps) => {
    const intialFocus = useRef(null)
    const [infoMessage, setInfoMessage] = useState<string>()

    return (
        <AnimatePresence>
            {open && (
                <Dialog
                    className="image-filters-editor ifb-modal"
                    static
                    initialFocus={intialFocus}
                    as={motion.div}
                    key="modal"
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    open={open}
                    onClose={onClose}>
                    <div className="absolute mx-auto w-full h-full pt-24 sm:p-8 sm:pt-24 lg:p-24">
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
                        <motion.div
                            key="modal"
                            initial={{ y: 30 }}
                            animate={{ y: 0 }}
                            exit={{ y: 0, opacity: 0 }}
                            className="flex flex-col bg-gray-50 h-full w-full relative shadow-lg overflow-hidden">
                            <ModalToolbar
                                onClose={onClose}
                                title={__('Select a filter', 'image-filters')}
                            />
                            <ModalContent
                                attributes={attributes}
                                setAttributes={setAttributes}
                                setImage={setImage}
                                setInfoMessage={setInfoMessage}
                                clientId={clientId}
                            />
                            <AnimatePresence>
                                {infoMessage && (
                                    <motion.div
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, bottom: '-40px' }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-white flex justify-start w-full p-2 py-1 shadow-lg absolute bottom-0 z-40 border-t border-gray-100">
                                        <p className="m-0 p-0 text-md font-bold">
                                            {infoMessage}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    )
}
