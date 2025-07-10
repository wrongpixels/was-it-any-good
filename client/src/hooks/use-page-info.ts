import { useContext } from 'react';
import {
  PageInfoContext,
  PageInfoContextValues,
} from '../context/PageInfoProvider';

export const usePageInfoContext = () => {
  const context: PageInfoContextValues | null = useContext(PageInfoContext);
  if (!context) {
    throw new Error('usePageInfo must be used within PageInfoProvider');
  }
  return context;
};
