'use client'

import { MessageCircle } from 'lucide-react'

export function FrapButton() {
  return (
    <button
      type="button"
      aria-label="Ayuda"
      className="btn-frap"
      onClick={() => {
        // TODO: Open help/chat modal
      }}
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  )
}
