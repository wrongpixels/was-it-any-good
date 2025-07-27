import { Session } from '../models';

export const logoutUser = async (userId: number | string): Promise<void> => {
  const removedSession = await Session.destroy({
    where: { userId },
  });
  console.log('Destroyed', removedSession);
  return;
};
