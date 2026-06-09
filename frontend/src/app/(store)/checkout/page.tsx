'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, ChevronLeft, Plus, MapPin, CreditCard, Shield, Package, Loader2, Check, X } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '@/lib/api/cart'
import { ordersApi } from '@/lib/api/orders'
import { usersApi } from '@/lib/api/users'
import { formatPrice } from '@/lib/utils/formatPrice'
import { cn } from '@/lib/utils/cn'
import type { Address, AddressRequest } from '@/types/address'

export default function CheckoutPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; message: string } | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [orderNotes, setOrderNotes] = useState('')
  const [couponError, setCouponError] = useState('')

  const { data: cart, isLoading: cartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
  })

  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: usersApi.getAddresses,
  })

  const addressMutation = useMutation({
    mutationFn: (data: AddressRequest) => usersApi.createAddress(data),
    onSuccess: (newAddress) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      setSelectedAddressId(newAddress.id)
      setShowAddressForm(false)
    },
  })

  const couponMutation = useMutation({
    mutationFn: (code: string) =>
      ordersApi.validateCoupon({ code, subtotal: cart?.subtotal ?? 0 }),
    onSuccess: (data) => {
      if (data.valid) {
        setAppliedCoupon({ code: couponCode.toUpperCase(), discount: data.discount, message: data.message })
        setCouponError('')
      } else {
        setCouponError(data.message)
        setAppliedCoupon(null)
      }
    },
    onError: () => {
      setCouponError('Error al validar cupón')
      setAppliedCoupon(null)
    },
  })

  const createOrderMutation = useMutation({
    mutationFn: () =>
      ordersApi.createOrder({
        addressId: selectedAddressId!,
        couponCode: appliedCoupon?.code,
        notes: orderNotes || undefined,
      }),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      router.push(`/orders/${order.orderNumber}?success=true`)
    },
  })

  const handleApplyCoupon = useCallback(() => {
    if (!couponCode.trim()) return
    couponMutation.mutate(couponCode.trim())
  }, [couponCode, couponMutation])

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }, [])

  const handlePlaceOrder = useCallback(() => {
    if (!selectedAddressId) return
    createOrderMutation.mutate()
  }, [selectedAddressId, createOrderMutation])

  const isLoading = cartLoading || addressesLoading

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="mb-6 h-16 w-16 text-brand-green-light/40" />
        <h1 className="font-sans text-[2.4rem] font-bold text-brand-green">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-[1.4rem] text-foreground-muted">
          Agrega productos antes de ir al checkout
        </p>
        <Link
          href="/products"
          className="btn-primary mt-6 px-8 py-4 text-[1.4rem]"
        >
          Explorar productos
        </Link>
      </div>
    )
  }

  const discount = appliedCoupon?.discount ?? 0
  const total = Math.max(0, cart.subtotal - discount)

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-col-xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[3.2rem] font-bold text-brand-green sm:text-[4rem]">
              Checkout
            </h1>
            <p className="mt-1 text-[1.4rem] text-foreground-muted">
              Revisa tu pedido y completa la compra
            </p>
          </div>
          <Link
            href="/cart"
            className="hidden items-center gap-2 text-[1.4rem] text-brand-accent hover:underline sm:flex"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver al carrito
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_38rem]">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Shipping Address */}
            <div className="card-starbucks p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-[2rem] font-semibold text-foreground">
                  Dirección de envío
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-1 text-[1.3rem] text-brand-accent hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  Nueva
                </button>
              </div>

              {showAddressForm && (
                <AddressForm
                  onSubmit={(data) => addressMutation.mutate(data)}
                  onCancel={() => setShowAddressForm(false)}
                  isLoading={addressMutation.isPending}
                />
              )}

              {addresses.length === 0 && !showAddressForm ? (
                <p className="text-[1.4rem] text-muted-foreground">
                  No tienes direcciones guardadas. Crea una nueva para continuar.
                </p>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={cn(
                        'w-full rounded-xl border-2 p-4 text-left transition-all',
                        selectedAddressId === addr.id
                          ? 'border-brand-accent bg-brand-accent/5'
                          : 'border-border hover:border-brand-accent/50'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{addr.fullName}</p>
                          <p className="mt-0.5 text-[1.3rem] text-muted-foreground">
                            {addr.street}, {addr.city}
                          </p>
                          <p className="text-[1.3rem] text-muted-foreground">
                            {addr.state}, {addr.postalCode}
                          </p>
                          {addr.phone && (
                            <p className="mt-0.5 text-[1.3rem] text-muted-foreground">
                              Tel: {addr.phone}
                            </p>
                          )}
                        </div>
                        {addr.isDefault && (
                          <span className="rounded-full bg-brand-accent/10 px-3 py-0.5 text-[1.1rem] text-brand-accent">
                            Default
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="card-starbucks p-6">
              <h2 className="mb-4 font-serif text-[2rem] font-semibold text-foreground">
                Productos ({cart.items.length})
              </h2>
              <div className="divide-y divide-border">
                {cart.items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
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
                    <div className="flex flex-1 justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{item.productName}</p>
                        {item.variantName && (
                          <p className="text-[1.3rem] text-muted-foreground">{item.variantName}</p>
                        )}
                        <p className="mt-1 text-[1.3rem] text-muted-foreground">
                          Cant: {item.quantity} x {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <p className="flex-shrink-0 font-medium text-foreground">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="card-starbucks p-6">
              <h2 className="mb-3 font-serif text-[2rem] font-semibold text-foreground">
                Notas del pedido
              </h2>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Instrucciones especiales para tu pedido..."
                rows={3}
                className="input-field w-full resize-none"
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-starbucks p-6">
              <h2 className="font-serif text-[2rem] font-semibold text-foreground">
                Resumen del pedido
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-[1.4rem]">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">{formatPrice(cart.subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[1.4rem]">
                    <span className="text-muted-foreground">
                      Descuento ({appliedCoupon?.message})
                    </span>
                    <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-[1.6rem] font-semibold text-foreground">Total</span>
                    <span className="text-[1.8rem] font-bold text-brand-accent">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="mt-6 border-t border-border pt-6">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-green-50 p-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-[1.3rem] text-green-700">{appliedCoupon.code}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Código de cupón"
                      className="input-field flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponMutation.isPending || !couponCode.trim()}
                      className="btn-outline flex-shrink-0 px-5 text-[1.3rem] disabled:opacity-50"
                    >
                      {couponMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Aplicar'
                      )}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="mt-2 text-[1.2rem] text-destructive">{couponError}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || createOrderMutation.isPending}
                className="mt-6 w-full rounded-full bg-brand-accent py-4 text-[1.4rem] font-semibold text-white hover:bg-brand-accent/90 boty-transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createOrderMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  'Confirmar pedido'
                )}
              </button>

              {!selectedAddressId && (
                <p className="mt-2 text-center text-[1.2rem] text-destructive">
                  Selecciona una dirección de envío
                </p>
              )}

              {createOrderMutation.isError && (
                <p className="mt-2 text-center text-[1.2rem] text-destructive">
                  {createOrderMutation.error instanceof Error
                    ? createOrderMutation.error.message
                    : 'Error al crear el pedido'}
                </p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 text-center boty-shadow">
                <Package className="h-6 w-6 text-brand-accent" />
                <span className="text-[1.2rem] font-medium text-foreground">Envío gratis</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 text-center boty-shadow">
                <CreditCard className="h-6 w-6 text-brand-accent" />
                <span className="text-[1.2rem] font-medium text-foreground">Pago seguro</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 text-center boty-shadow">
                <Shield className="h-6 w-6 text-brand-accent" />
                <span className="text-[1.2rem] font-medium text-foreground">Devolución fácil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddressForm({
  onSubmit,
  onCancel,
  isLoading,
}: {
  onSubmit: (data: AddressRequest) => void
  onCancel: () => void
  isLoading: boolean
}) {
  const [form, setForm] = useState<AddressRequest>({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'MX',
    isDefault: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  const update = (field: keyof AddressRequest, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl bg-muted/30 p-4">
      <div>
        <label className="text-[1.3rem] font-medium text-foreground">Nombre completo *</label>
        <input
          type="text"
          required
          value={form.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          className="input-field mt-1 w-full"
        />
      </div>
      <div>
        <label className="text-[1.3rem] font-medium text-foreground">Teléfono</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          className="input-field mt-1 w-full"
        />
      </div>
      <div>
        <label className="text-[1.3rem] font-medium text-foreground">Calle y número *</label>
        <input
          type="text"
          required
          value={form.street}
          onChange={(e) => update('street', e.target.value)}
          className="input-field mt-1 w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[1.3rem] font-medium text-foreground">Ciudad *</label>
          <input
            type="text"
            required
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
            className="input-field mt-1 w-full"
          />
        </div>
        <div>
          <label className="text-[1.3rem] font-medium text-foreground">Estado</label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => update('state', e.target.value)}
            className="input-field mt-1 w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[1.3rem] font-medium text-foreground">Código postal *</label>
          <input
            type="text"
            required
            value={form.postalCode}
            onChange={(e) => update('postalCode', e.target.value)}
            className="input-field mt-1 w-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={form.isDefault}
          onChange={(e) => update('isDefault', e.target.checked)}
          className="h-4 w-4 rounded border-border text-brand-accent"
        />
        <label htmlFor="isDefault" className="text-[1.3rem] text-foreground">
          Establecer como dirección predeterminada
        </label>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={isLoading} className="btn-primary flex-1 py-3 text-[1.3rem]">
          {isLoading ? 'Guardando...' : 'Guardar dirección'}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline flex-1 py-3 text-[1.3rem]">
          Cancelar
        </button>
      </div>
    </form>
  )
}
