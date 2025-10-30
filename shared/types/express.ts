import { ActiveUser } from './models'

//we declare an optional activeUser, activeSlug, and activeRedisKey in all Requests for
//flexibility and universal optional access in every request.
declare module 'express' {
  interface Request {
    activeUser?: ActiveUser
    activeSlug?: string
    activeRedisKey?: string
  }
}
