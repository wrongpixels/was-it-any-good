import { Request } from 'express';

//a helper that extracts and sorts in the same order the queries
//of a rquest. Used for automatic Redis key generations
export const extractAllQueries = (req: Request): string[] => {
  const queries: string[] = [];

  Object.entries(req.query)
    .filter(([, value]) => value != null && value !== '')
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .forEach(([key, value]) => {
      let valStr: string;
      if (Array.isArray(value)) {
        valStr = value
          .filter((v) => v != null && v !== '')
          .map(String)
          .join(',');
      } else {
        valStr = String(value).trim();
      }
      if (valStr) {
        queries.push(`${key}:${valStr}`);
      }
    });
  return queries;
};
