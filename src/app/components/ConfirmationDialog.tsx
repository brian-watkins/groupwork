"use client"

import { PropsWithChildren, useContext, useState } from "react"
import {
  Button,
  Dialog,
  Heading,
  Modal,
  ModalOverlay,
  OverlayTriggerStateContext,
} from "react-aria-components"

export function ConfirmationDialog({ children, ...props }: PropsWithChildren) {
  return (
    <ModalOverlay
      className={({ isEntering, isExiting }) => `
  fixed inset-0 z-10 overflow-y-auto bg-black/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur
  ${isEntering ? "animate-in fade-in duration-300 ease-out" : ""}
  ${isExiting ? "animate-out fade-out duration-200 ease-in" : ""}
  `}
    >
      <Modal>
        <Dialog
          role="alertdialog"
          className="bg-slate-200 p-8 rounded"
          {...props}
        >
          {children}
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}

export function ConfirmationDialogHeader({ children }: PropsWithChildren) {
  return (
    <Heading
      level={3}
      className="text-lg font-medium text-gray-900 hover:text-sky-600"
      data-course-name
    >
      {children}
    </Heading>
  )
}

export function ConfirmationDialogMessage({ children }: PropsWithChildren) {
  return (
    <div data-confirmation-message className="text-gray-600">
      {children}
    </div>
  )
}

interface DialogActionProps {
  children: string
  onConfirm: () => Promise<void>
}

export function ConfirmationDialogAction({
  onConfirm,
  children,
}: DialogActionProps) {
  const actions = useContext(OverlayTriggerStateContext)
  const [isPending, setIsPending] = useState(false)

  async function handleConfirm() {
    setIsPending(true)
    await onConfirm()
    setIsPending(false)
    actions?.close()
  }

  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        data-cancel
        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        onPress={actions?.close}
      >
        Cancel
      </Button>
      <Button
        data-delete
        isPending={isPending}
        className={({ isPending }) =>
          `px-4 py-2 ${isPending ? "bg-slate-600" : "bg-red-600"} text-white rounded-md hover:bg-red-700 transition-colors`
        }
        onPress={handleConfirm}
      >
        {children}
      </Button>
    </div>
  )
}
