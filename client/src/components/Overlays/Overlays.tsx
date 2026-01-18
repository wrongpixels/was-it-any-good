import { JSX } from 'react';
import { useOverlay } from '../../context/OverlayProvider';
import ImageOverlay from './ImageOverlay';
import SignUpOverlay from './SignUpOverlay';

const Overlays = (): JSX.Element | null => {
  const { overlay, clean, setCloseWarn, closeWarn } = useOverlay();
  if (!overlay) {
    return null;
  }

  return (
    <>
      <ImageOverlay overlay={overlay} clean={clean} />
      <SignUpOverlay
        overlay={overlay}
        clean={clean}
        closeWarn={closeWarn}
        setCloseWarn={setCloseWarn}
      />
    </>
  );
};

export default Overlays;
