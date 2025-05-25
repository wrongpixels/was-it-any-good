export enum FilmParental {
  G = 'General Audience',
  PG = 'Parental Guidance Suggested',
  PG13 = 'Parental Guidance for Children Under 13',
  R = 'Restricted',
  NC17 = 'Adults Only',
}

export enum ShowParental {
  TVY = 'All Children',
  TVY7 = 'Directed to Older Children Age 7 and Above',
  TVY7FV = 'Directed to Older Children - Fantasy Violence',
  TVG = 'General Audience',
  TVPG = 'Parental Guidance Suggested',
  TV14 = 'Parents Strongly Cautioned',
  TVMA = 'Mature Audience',
}

export enum GameParental {
  EC = 'Early Childhood',
  E = 'Everyone',
  E10 = 'Everyone 10+',
  T = 'Teen',
  M = 'Mature 17+',
  AO = 'Adults Only 18+',
  RP = 'Rating Pending',
}

export type ParentalGuide = GameParental | FilmParental | ShowParental;
