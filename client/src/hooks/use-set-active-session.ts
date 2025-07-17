import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { isSessionDataValid } from '../../../shared/helpers/auth-helper';
import { UserSessionData } from '../../../shared/types/models';
import { SESSION_QUERY_KEY } from '../constants/session-constants';
import {
  logoutClientSide,
  saveLocalUserSession,
} from '../utils/session-handler';

export interface SetActiveSessionValues {
  setSession: (session?: UserSessionData | null) => UserSessionData | null;
}

export const useSetActiveSession = (): SetActiveSessionValues => {
  const queryClient: QueryClient = useQueryClient();
  const setSession = (
    session?: UserSessionData | null
  ): UserSessionData | null => {
    if (!session || !isSessionDataValid(session)) {
      logoutClientSide(queryClient);
      return null;
    }
    saveLocalUserSession(session);
    queryClient.resetQueries();
    queryClient.setQueryData(SESSION_QUERY_KEY, session);
    return session;
  };
  return { setSession };
};
