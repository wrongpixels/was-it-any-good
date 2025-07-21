import { useState } from 'react';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';
import LoadingSpinner from './icons/LoadingSpinner';

export enum AspectRatio {
  square = 'aspect-square',
  video = 'aspect-video',
  picture = 'aspect-[4/3]',
  poster = 'aspect-[2/3]',
}

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspect?: AspectRatio;
}

const LazyImage = ({
  className,
  aspect = AspectRatio.poster,
  ...props
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={mergeClassnames('relative w-full', aspect, className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center overflow-hidden justify-center bg-gray-100">
          <LoadingSpinner className="w-8" />
        </div>
      )}
      <img
        {...props}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover rounded-sm"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default LazyImage;
