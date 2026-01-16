import { JSX } from 'react';
import { useOverlay } from '../../context/OverlayProvider';
import ImageOverlay from './ImageOverlay';
import SignUpOverlay from './SignUpOverlay';

const Overlays = (): JSX.Element | null => {
  const { overlay, clean } = useOverlay();
  if (!overlay) {
    return null;
  }

  return (
    <>
      <ImageOverlay overlay={overlay} clean={clean} />
      <SignUpOverlay overlay={overlay} clean={clean} />
    </>
  );
};

export default Overlays;
