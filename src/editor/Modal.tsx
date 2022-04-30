import { useRef } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useWpImage } from '../hooks/useWpImage'
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
    const { originalImageId } = attributes
    const wpImage = useWpImage(originalImageId)
    const setImage = (image: ImageData) => {
        console.log({ wpImage, image, clientId })
    }

    // how to accept and persist data
    // After that, get the image info and create a new image block
    // by cloning the existing one
    // TODO:
    // - Add revert button on sidebar
    // first one be original image?
    // Add warning about complex images
    // Check why originalimage isnt updating
    // - figure out how to save an image to the media library
    // - replace the media in the inner block or just replace the entire block before closing the modal
    // Generally check for performance improvements

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
                            />
                        </motion.div>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    )
}
