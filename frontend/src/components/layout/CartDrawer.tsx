'use client'

import { X, ShoppingBag, Trash2, Minus, Plus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils/formatPrice'
import { cn } from '@/lib/utils/cn'

export function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, removeItem, updateQuantity } =
    useCart()

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
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-soft transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-2.5">
          <div>
            <h2 className="font-serif text-[2rem] text-foreground">Carrito</h2>
            <p className="text-[1.4rem] text-muted-foreground">{items.length} {items.length === 1 ? 'artículo' : 'artículos'}</p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="p-2 text-foreground/70 hover:text-foreground boty-transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-4 text-[1.4rem] text-brand-accent hover:underline"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground/30">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-[1.5rem] text-foreground mb-1 font-semibold">
                      {item.productName}
                    </h3>
                    <p className="text-muted-foreground mb-3 text-[1.4rem]">{item.variantName}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-full">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1.5 hover:bg-muted boty-transition rounded-l-full"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-[1.4rem] font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1.5 hover:bg-muted boty-transition rounded-r-full"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                          onClick={() => removeItem(item.variantId)}
                        className="p-1.5 text-muted-foreground hover:text-destructive boty-transition"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-medium text-foreground">{formatPrice(item.totalPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-black/10 p-6 space-y-4">
            <div className="flex justify-between text-[1.4rem]">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <button
              type="button"
              className="w-full bg-brand-accent text-white py-4 rounded-full font-medium hover:bg-brand-accent/90 boty-transition"
            >
              Ir a pagar
            </button>
            <button
              type="button"
              onClick={closeCart}
              className="w-full border border-border text-foreground py-4 rounded-full font-medium hover:bg-muted boty-transition"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
