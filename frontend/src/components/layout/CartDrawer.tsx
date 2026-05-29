'use client'

import { useEffect } from 'react'
import { X, ShoppingBag, Trash2, Minus, Plus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils/formatPrice'
import { cn } from '@/lib/utils/cn'

export function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, removeItem, updateQuantity } =
    useCart()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />
      )}

      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-card transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-ceramic px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-green" />
            <h2 className="text-[1.6rem] font-semibold text-foreground">
              Carrito ({items.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="rounded-pill p-2 text-foreground-muted transition-colors hover:bg-ceramic"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 text-center">
              <ShoppingBag className="mb-4 h-12 w-12 text-foreground-muted/40" />
              <p className="text-[1.4rem] text-foreground-muted">Tu carrito está vacío</p>
              <button
                type="button"
                onClick={closeCart}
                className="btn-primary mt-6"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-card bg-canvas p-4"
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-[4px] bg-ceramic">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-foreground-muted/30">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[1.4rem] font-medium text-foreground">
                          {item.productName}
                        </p>
                        <p className="text-[1.2rem] text-foreground-muted">
                          {item.variantName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="Eliminar"
                        className="rounded-full p-1 text-foreground-muted transition-colors hover:bg-red-50 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-ceramic bg-white text-foreground-muted transition-colors hover:border-brand-accent hover:text-brand-accent"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-[1.4rem] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-ceramic bg-white text-foreground-muted transition-colors hover:border-brand-accent hover:text-brand-accent"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-[1.4rem] font-semibold text-foreground">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ceramic px-6 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[1.4rem] font-medium text-foreground-muted">
                Subtotal
              </span>
              <span className="text-[1.8rem] font-bold text-foreground">
                {formatPrice(subtotal)}
              </span>
            </div>
            <button
              type="button"
              className="btn-primary w-full"
              onClick={closeCart}
            >
              Ir a pagar
            </button>
          </div>
        )}
      </div>
    </>
  )
}
