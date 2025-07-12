import { CreditResponse, MergedCredits, PersonResponse } from '../types/models'
import { Image } from '../types/common'
export const DEF_IMAGE_PERSON: Image = '/def-person.png'
export const DEF_IMAGE_MEDIA: Image = '/def-media.png'

export const DEF_SYNOPSIS: string = `Missing synopsis! Why don't you add one?`

export const UNKNOWN_PERSON: PersonResponse = {
  id: -1,
  name: 'Unknown',
  image: DEF_IMAGE_PERSON,
  country: ['UNKNOWN'],
}

export const UNKNOWN_ACTOR: PersonResponse = {
  id: -1,
  name: 'Unknown Cast',
  image: DEF_IMAGE_PERSON,
  country: ['UNKNOWN'],
}

export const UNKNOWN_CAST: CreditResponse[] = [
  {
    id: -1,
    role: '',
    characterName: [' '],
    person: UNKNOWN_ACTOR,
  },
]

export const UNKNOWN_CREATORS: PersonResponse = {
  ...UNKNOWN_PERSON,
  name: 'Unknown Crew',
}

export const UNKNOWN_DIRECTORS: PersonResponse = {
  ...UNKNOWN_PERSON,
  name: 'Unknown Direction',
}

export const DEF_CREW: MergedCredits[] = [
  {
    mergedRoles: [],
    person: UNKNOWN_CREATORS,
  },
]

export const DEF_CREW_TV: MergedCredits[] = [
  {
    mergedRoles: [],
    person: UNKNOWN_CREATORS,
  },
]
