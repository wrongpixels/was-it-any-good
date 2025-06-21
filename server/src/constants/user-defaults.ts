import { ActiveUser, DefaultUser } from '../../../shared/types/models';

export const DEF_USER: DefaultUser = {
  pfp: null,
  lastActive: null,
  isActive: true,
  isAdmin: false,
};

export const INV_ACTIVE_USER: ActiveUser = {
  id: -1,
  isValid: false,
  username: '',
  name: '',
  lastActive: null,
  isAdmin: false,
  isActive: false,
};
