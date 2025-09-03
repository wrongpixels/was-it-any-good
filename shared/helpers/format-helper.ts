export const getYearParenthesis = (
  dateString: string | null | undefined
): string => {
  const year: string = getYearString(dateString);
  if (!year || year === "") {
    return "";
  }
  return `(${year})`;
};

export const getYearString = (
  dateString: string | null | undefined
): string => {
  const year: number | null = getYearNum(dateString);
  if (!year) {
    return "";
  }
  return year.toString();
};

export const getYearNum = (
  dateString: string | null | undefined
): number | null => {
  if (!dateString) {
    return null;
  }
  const date: Date = new Date(dateString);
  const year: number = date.getFullYear();
  return isNaN(year) ? null : year;
};

export const isNumber = (value?: unknown): value is number =>
  typeof value === "number" && !isNaN(value);

export const hasNumber = (text: string) => /\d/.test(text);
export const toFirstUpperCase = (text: string) => {
  if (!text) return text;
  return text[0].toUpperCase() + text.slice(1);
};
