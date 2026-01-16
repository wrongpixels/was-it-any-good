import { OverlayContextValues } from '../context/OverlayProvider';

export enum OverlayType {
  Image,
  SignUp,
  None,
}

export interface OverlayProps {
  overlay: OverlayContextValues;
  clean: () => void;
}
