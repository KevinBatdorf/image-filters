import { Button } from '@wordpress/components'
import { useRef } from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { toHumanBytes } from '../lib/utils'
import { ModalToolbar } from './ModalToolbar'

type ModalProps = {
    open: boolean
    size: number
    accept: () => void
    onClose: () => void
}

export const ConfirmFileSizeNotice = ({
    open,
    onClose,
    size,
    accept,
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
                    <div className="absolute mx-auto w-full h-full flex items-center justify-center p-8">
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
                        <motion.div
                            key="modal"
                            initial={{ y: 30 }}
                            animate={{ y: 0 }}
                            exit={{ y: 0, opacity: 0 }}
                            className="relative rounded-md shadow-lg overflow-hidden w-96 max-w-full">
                            <ModalToolbar
                                onClose={onClose}
                                title={__(
                                    'Confirm large file size',
                                    'image-filters-block',
                                )}
                            />
                            <div className="p-4 bg-gray-50">
                                <p className="text-base">
                                    {sprintf(
                                        __(
                                            'Just a heads up! This image (%s) is a little large and may take slightly longer to process.',
                                            'image-filters-block',
                                        ),
                                        toHumanBytes(size),
                                    )}
                                </p>
                                <div className="flex justify-end">
                                    <Button
                                        ref={intialFocus}
                                        variant="primary"
                                        onClick={accept}>
                                        {__(
                                            'Open filters',
                                            'image-filters-block',
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    )
}
