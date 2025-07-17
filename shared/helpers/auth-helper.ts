import { AUTH_EXPIRE_TIME } from '../constants/auth-constants'
import { UserSessionData } from '../types/models'

export const isSessionDataValid = (
  session?: UserSessionData | null,
): boolean => {
  if (!session?.id || !session.token || !session.userId) {
    return false
  }
  return !isDateExpired(session.createdAt)
}

export const isDateExpired = (oldDate: Date | string | number): boolean => {
  if (!oldDate) {
    return true
  }
  const currentTime = new Date().getTime()
  const oldDateTime =
    oldDate instanceof Date ? oldDate.getTime() : new Date(oldDate).getTime()
  return currentTime - oldDateTime > AUTH_EXPIRE_TIME
}
