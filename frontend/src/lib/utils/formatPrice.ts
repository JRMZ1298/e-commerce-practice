const priceFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export function formatPrice(price: number): string {
  return priceFormatter.format(price)
}
