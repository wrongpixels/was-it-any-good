import { Session } from '../models';

export const logoutUser = async (userId: number | string): Promise<void> => {
  await Session.destroy({
    where: { userId },
  });
  return;
};
