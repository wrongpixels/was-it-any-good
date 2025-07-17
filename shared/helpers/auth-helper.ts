import { UserSessionData } from '../types/models'

export const isSessionDataValid = (
  session?: UserSessionData | null,
): boolean => {
  if (!session?.id || !session.token || !session.userId) {
    return false
  }
  return !isDateExpired(session.createdAt)
}

const isDateExpired = (date: Date): boolean => {
  if (!date) {
    return true
  }
  const receivedDate: number = date.getDate()
  const currentDate: number = new Date().getDate()
  return currentDate - receivedDate > AUTH_EXPIRE_TIME
}
