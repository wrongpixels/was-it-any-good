import { createContext, PropsWithChildren, useContext, useState } from 'react';

export interface OverlayContextValues {
  image: string;
  active: boolean;
  className?: string;
}

export interface OverlayValues {
  overlay: OverlayContextValues;
  setOverlay: (overlay: OverlayContextValues) => void;
  openAsOverlay: (image: string, className?: string) => void;
  clean: () => void;
}

const DEF_OVERLAY: OverlayContextValues = {
  image: '',
  active: false,
  className: '',
};

const OverlayContext = createContext<OverlayValues>({
  overlay: DEF_OVERLAY,
  setOverlay: () => {},
  openAsOverlay: () => {},
  clean: () => {},
});

const OverlayProvider = ({ children }: PropsWithChildren) => {
  const [overlay, setOverlay] = useState(DEF_OVERLAY);

  return (
    <OverlayContext.Provider
      value={{
        overlay,
        setOverlay,
        openAsOverlay: (image: string, className?: string) =>
          setOverlay({ ...DEF_OVERLAY, active: true, image, className }),
        clean: () => setOverlay(DEF_OVERLAY),
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
