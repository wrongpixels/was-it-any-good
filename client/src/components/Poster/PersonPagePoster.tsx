import { JSX } from 'react';
import LazyImage, { AspectRatio, ImageVariant } from '../common/LazyImage';
import { styles } from '../../constants/tailwind-styles';
import imageLinker from '../../../../shared/util/image-linker';
import { useOverlay } from '../../context/OverlayProvider';

interface PersonPagePosterProps {
  src: string;
  alt: string;
  title?: string;
  extraInfo?: string;
}
const PersonPagePoster = ({
  extraInfo,
  src,
}: PersonPagePosterProps): JSX.Element => {
  const { openImageAsOverlay: openAsOverlay } = useOverlay();

  return (
    <div className={`${styles.poster.regular()} flex flex-col gap-1`}>
      <LazyImage
        aspect={AspectRatio.poster}
        src={imageLinker.getBigAvatarImage(src)}
        variant={ImageVariant.inline}
        className={`rounded shadow ring-1 ring-gray-300 ${styles.poster.media} min-h-57 `}
        onClick={() => openAsOverlay(imageLinker.getFullSizeImage(src))}
      />
      <span className="p-0.5 mt-0.5 font-semibold text-sm leading-tight break-words text-gray-500 text-center">
        {extraInfo}
      </span>
    </div>
  );
};

export default PersonPagePoster;
