import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { OverlayType } from '../types/overlay-types';

export interface OverlayContextValues {
  image: string | undefined;
  active: boolean;
  overlayType: OverlayType;
  className?: string;
  confirmClose?: boolean;
  closeMessage?: string;
}

export interface OverlayValues {
  overlay: OverlayContextValues;
  setOverlay: (overlay: OverlayContextValues) => void;
  openSignUpOverlay: () => void;
  setCloseWarn?: (value: boolean) => void;
  closeWarn: boolean;
  openImageAsOverlay: (image: string, className?: string) => void;
  clean: () => void;
}

const DEF_OVERLAY: OverlayContextValues = {
  image: undefined,
  active: false,
  overlayType: OverlayType.None,
  className: '',
  confirmClose: false,
  closeMessage: undefined,
};

const OverlayContext = createContext<OverlayValues>({
  overlay: DEF_OVERLAY,
  setOverlay: () => {},
  setCloseWarn: () => {},
  closeWarn: false,
  openSignUpOverlay: () => {},
  openImageAsOverlay: () => {},
  clean: () => {},
});

const OverlayProvider = ({ children }: PropsWithChildren) => {
  const [overlay, setOverlay] = useState(DEF_OVERLAY);
  const [closeWarn, setCloseWarn] = useState(false);

  return (
    <OverlayContext.Provider
      value={{
        overlay,
        setOverlay,
        setCloseWarn: overlay.confirmClose ? setCloseWarn : undefined,
        closeWarn,
        openSignUpOverlay: () =>
          setOverlay({
            ...DEF_OVERLAY,
            active: true,
            overlayType: OverlayType.SignUp,
            confirmClose: true,
            closeMessage:
              "Closing will discard the user details you've entered.\n\nClose anyway?",
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
          if (overlay.confirmClose && closeWarn) {
            const ok: boolean =
              window.confirm(
                overlay.closeMessage ??
                  'If you close now, your changes will be lost.\n\nProceed?'
              ) === true;
            if (!ok) {
              return;
            }
          }
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
