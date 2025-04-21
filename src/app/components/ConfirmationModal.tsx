"use client"

import {
  Dialog,
  Button,
  Modal,
  ModalOverlay,
  Heading,
} from "react-aria-components"
import { useState } from "react"

interface ConfirmationModalProps {
  title: string
  message: React.ReactNode
  confirmButtonText: string
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  testId?: string
}

export function ConfirmationModal({
  title,
  message,
  confirmButtonText,
  isOpen,
  onClose,
  onConfirm,
  testId,
}: ConfirmationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    try {
      setIsProcessing(true)
      await onConfirm()
      onClose()
    } catch (error) {
      console.error(`Error during confirmation action:`, error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ModalOverlay
      isDismissable
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <Modal
        data-testid={testId}
        className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg"
      >
        <Dialog className="outline-none">
          <Heading slot="title" className="text-lg font-semibold mb-4">
            {title}
          </Heading>
          <div className="space-y-4">
            <div data-confirmation-message className="text-gray-600">
              {message}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                data-cancel
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                onPress={onClose}
                isDisabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                data-delete
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                onPress={handleConfirm}
                isDisabled={isProcessing}
              >
                {isProcessing ? "Processing..." : confirmButtonText}
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
