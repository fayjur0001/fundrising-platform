// src/components/common/ConfirmDialog.tsx
'use client'

import React from 'react'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-slate-600 mb-6">{description}</p>
      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" size="sm" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          size="sm"
          onClick={() => { onConfirm(); onClose() }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}