export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'long',
  }).format(new Date(date))
}
