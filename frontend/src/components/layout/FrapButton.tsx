'use client'

import { ShoppingBag } from 'lucide-react'

export function FrapButton() {
  return (
    <button
      type="button"
      aria-label="Carrito"
      className="btn-frap"
      onClick={() => {
        // TODO: Open cart / special offers
      }}
    >
      <ShoppingBag className="h-6 w-6" />
    </button>
  )
}
