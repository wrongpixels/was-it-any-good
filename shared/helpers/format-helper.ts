import { formatCountry } from "../types/countries";

export const getYearString = (
  dateString: string | null | undefined
): string => {
  const year: number | null = getYearNum(dateString);
  if (!year) {
    return "";
  }
  return year.toString();
};

export const getYearParenthesis = (
  dateString: string | null | undefined
): string => tryAddParenthesis(getYearString(dateString));

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

export const formatBirthPlace = (
  text: string | undefined | null
): string | undefined => {
  if (!text || text === undefined) {
    return undefined;
  }
  const sections: string[] = text.split(", ");
  if (!sections) {
    return text;
  }
  const country: string | undefined = sections.pop();
  if (country) {
    sections.push(formatCountry(country));
  }
  return sections.join(", ");
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

//a function that gets the age of a person, correcting for birthdays and
//allowing for an optional end date instead of current
export const getAge = (
  bornInput: string | Date,
  endInput?: string | Date
): number | null => {
  const bornDate: Date = new Date(bornInput);
  if (isNaN(bornDate.getTime())) {
    return null;
  }
  //if we don't provide an endDate, we use the current date
  const endDate: Date = endInput ? new Date(endInput) : new Date();
  if (isNaN(endDate.getTime())) {
    return null;
  }

  //first we simply check the difference of years from today
  let age: number = endDate.getFullYear() - bornDate.getFullYear();

  //and we check if this year's birthday has already happened
  const monthDiff: number = endDate.getMonth() - bornDate.getMonth();
  const dayDiff: number = endDate.getDate() - bornDate.getDate();

  //if not, we remove a year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

//a function that tries to put into parenthesis the input or returns
//an empty string, so nothing will be displayed if empty
export const tryAddParenthesis = (
  input: string | null | number | Date | undefined
): string => {
  if (!input) {
    return "";
  }
  return `(${input})`;
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
