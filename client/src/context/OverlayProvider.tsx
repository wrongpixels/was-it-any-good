import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { OverlayType } from '../types/overlay-types';

export interface OverlayContextValues {
  image: string | undefined;
  active: boolean;
  overlayType: OverlayType;
  className?: string;
  confirmClose?: boolean;
}

export interface OverlayValues {
  overlay: OverlayContextValues;
  setOverlay: (overlay: OverlayContextValues) => void;
  openSignUpOverlay: () => void;
  openImageAsOverlay: (image: string, className?: string) => void;
  clean: () => void;
}

const DEF_OVERLAY: OverlayContextValues = {
  image: undefined,
  active: false,
  overlayType: OverlayType.None,
  className: '',
  confirmClose: false,
};

const OverlayContext = createContext<OverlayValues>({
  overlay: DEF_OVERLAY,
  setOverlay: () => {},
  openSignUpOverlay: () => {},
  openImageAsOverlay: () => {},
  clean: () => {},
});

const OverlayProvider = ({ children }: PropsWithChildren) => {
  const [overlay, setOverlay] = useState(DEF_OVERLAY);
  useEffect(() => {}, []);
  return (
    <OverlayContext.Provider
      value={{
        overlay,
        setOverlay,
        openSignUpOverlay: () =>
          setOverlay({
            ...DEF_OVERLAY,
            active: true,
            overlayType: OverlayType.SignUp,
          }),
        openImageAsOverlay: (image: string, className?: string) =>
          setOverlay({
            ...DEF_OVERLAY,
            active: true,
            image,
            className,
            overlayType: OverlayType.Image,
          }),
        clean: () => {
          setOverlay(DEF_OVERLAY);
        },
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = (): OverlayValues => {
  const overlay = useContext(OverlayContext);
  if (!overlay) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return overlay;
};

export default OverlayProvider;
