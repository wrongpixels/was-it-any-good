export const getYear = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return ''
  }
  const date: Date = new Date(dateString)
  const year: number = date.getFullYear()
  return isNaN(year) ? '' : `(${year})`
}

export const getYearNum = (
  dateString: string | null | undefined,
): number | null => {
  if (!dateString) {
    return null
  }
  const date: Date = new Date(dateString)
  const year: number = date.getFullYear()
  return isNaN(year) ? null : year
}

export const isNumber = (value?: unknown): value is number =>
  typeof value === 'number' && !isNaN(value)
