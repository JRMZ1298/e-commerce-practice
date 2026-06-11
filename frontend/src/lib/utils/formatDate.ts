const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'long',
})

export function formatDate(date: string | Date): string {
  return dateFormatter.format(new Date(date))
}
