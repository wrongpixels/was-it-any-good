import { ShowResponse } from '../../../shared/types/models';
import { LAST_CHECK_DAYS_SHOW } from '../constants/media-defaults';

export const isShowDataOld = (show: ShowResponse): boolean => {
  if (!show.updatedAt) {
    return true;
  }
  const editDate: Date = new Date(show.updatedAt);
  if (isNaN(editDate.getTime())) {
    return true;
  }
  const today: Date = new Date();
  const lastCheckCut: Date = new Date(today);
  lastCheckCut.setDate(lastCheckCut.getDate() - LAST_CHECK_DAYS_SHOW);

  return editDate < lastCheckCut;
};
