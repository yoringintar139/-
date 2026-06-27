export function formatDate(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) return yyyymmdd
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`
}

export function toYYYYMMDD(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '')
}
