import { Button, CheckboxControl } from '@wordpress/components'
import { useRef, useState } from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { toHumanBytes } from '../lib/utils'
import { ModalToolbar } from './ModalToolbar'

type ModalProps = {
    open: boolean
    size: number
    onAccept: () => void
    onAcceptPersist: () => void
    onClose: () => void
}

export const ConfirmFileSizeNotice = ({
    open,
    onClose,
    size,
    onAccept,
    onAcceptPersist,
}: ModalProps) => {
    const intialFocus = useRef(null)
    const [always, setAlways] = useState(false)
    const handleClick = () => {
        if (always) {
            onAcceptPersist()
            return
        }
        onAccept()
    }

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
                    <div className="absolute mx-auto w-full h-full flex items-center justify-center p-8">
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
                        <motion.div
                            key="modal"
                            initial={{ y: 30 }}
                            animate={{ y: 0 }}
                            exit={{ y: 0, opacity: 0 }}
                            className="relative shadow-lg overflow-hidden w-96 max-w-full">
                            <ModalToolbar
                                onClose={onClose}
                                title={__(
                                    'Confirm large file size',
                                    'image-filters',
                                )}
                            />
                            <div className="p-4 bg-gray-50">
                                <p className="text-base">
                                    {sprintf(
                                        __(
                                            'Just a heads up! This image (%s) is a little large and may take slightly longer to generate.',
                                            'image-filters',
                                        ),
                                        toHumanBytes(size),
                                    )}
                                </p>
                                <div className="flex justify-between items-center space-x-2">
                                    <CheckboxControl
                                        className="checkbox-control-mb-0"
                                        label={__(
                                            'Always for this image',
                                            'image-filters',
                                        )}
                                        checked={always}
                                        onChange={(value) => setAlways(value)}
                                    />
                                    <Button
                                        ref={intialFocus}
                                        variant="primary"
                                        onClick={handleClick}>
                                        {__('Open filters', 'image-filters')}
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
