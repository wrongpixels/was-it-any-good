import { JSX } from 'react';
import LazyImage, { AspectRatio, ImageVariant } from '../common/LazyImage';
import { styles } from '../../constants/tailwind-styles';
import imageLinker from '../../../../shared/util/image-linker';
import { useOverlay } from '../../context/OverlayProvider';

interface BasicPosterProps {
  src: string;
  alt: string;
  title?: string;
  extraInfo?: string;
}
const BasicPoster = ({ extraInfo, src }: BasicPosterProps): JSX.Element => {
  const { openAsOverlay } = useOverlay();

  return (
    <div className="bg-white shadow-md rounded border-9 border-white ring-1 ring-gray-300 self-start flex flex-col gap-1">
      <LazyImage
        aspect={AspectRatio.poster}
        src={imageLinker.getBigAvatarImage(src)}
        variant={ImageVariant.inline}
        className={`rounded shadow ring-1 ring-gray-300 ${styles.poster.media} min-h-53 `}
        onClick={() => openAsOverlay(imageLinker.getFullSizeImage(src))}
      />
      <span className="p-0.5 mt-0.5 font-medium text-sm leading-tight break-words text-gray-500 text-center">
        {extraInfo}
      </span>
    </div>
  );
};

export default BasicPoster;
