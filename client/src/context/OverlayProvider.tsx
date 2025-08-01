import { createContext, PropsWithChildren, useContext, useState } from 'react';

interface OverlayContextValues {
  image: string;
  active: boolean;
  className?: string;
}

interface OverlayValues {
  overlay: OverlayContextValues;
  setOverlay: (overlay: OverlayContextValues) => void;
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
  clean: () => {},
});

const OverlayProvider = ({ children }: PropsWithChildren) => {
  const [overlay, setOverlay] = useState(DEF_OVERLAY);

  return (
    <OverlayContext.Provider
      value={{
        overlay,
        setOverlay,
        clean: () => setOverlay({ ...overlay, active: false }),
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

export const userOverlay = (): OverlayValues => {
  const overlay = useContext(OverlayContext);
  if (!overlay) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return overlay;
};

export default OverlayProvider;
