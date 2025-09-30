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

//for formatting dates as 'apr 07, 2025'
export const formatRatingDate = (dateInput: Date | string): string => {
  const date: Date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const today: Date = new Date();
  const yesterday: Date = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return formatDate(date).toLowerCase();
};

export const formatDate = (dateInput: Date | string): string => {
  const date: Date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  const formattedDate: string = new Intl.DateTimeFormat(
    "en-US",
    options
  ).format(date);

  return formattedDate;
};

export const isNumber = (value?: unknown): value is number =>
  typeof value === "number" && !isNaN(value);

export const hasNumber = (input: string): boolean => /\d/.test(input);

export const isEmail = (input: string): boolean => {
  if (!input || input.length < 6) {
    return false;
  }
  const [account, domain]: string[] = input.split("@");
  if (!account || !domain) {
    return false;
  }
  const [provider, end]: string[] = domain.split(".");
  return provider.length > 0 && end.length > 1;
};

export const toFirstUpperCase = (input: string) => {
  if (!input) return input;
  return input[0].toUpperCase() + input.slice(1);
};
