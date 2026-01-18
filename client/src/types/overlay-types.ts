import { OverlayContextValues } from '../context/OverlayProvider';

export enum OverlayType {
  Image,
  SignUp,
  None,
}

export interface OverlayProps {
  overlay: OverlayContextValues;
  clean: () => void;
  closeWarn?: boolean;
  setCloseWarn?: (value: boolean) => void;
}
