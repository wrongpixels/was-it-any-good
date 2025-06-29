export const getYear = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return '';
  }
  const date: Date = new Date(dateString);
  const year: number = date.getFullYear();
  return isNaN(year) ? '' : `(${year})`;
};
