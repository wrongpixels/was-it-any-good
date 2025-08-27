import { useState } from 'react';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';
import LoadingSpinner from './icons/IconLoadingSpinner';

export enum AspectRatio {
  square = 'aspect-square',
  video = 'aspect-video',
  picture = 'aspect-[4/3]',
  poster = 'aspect-[2/3]',
}

export enum ImageVariant {
  default = 'default',
  inline = 'inline',
  overlay = 'overlay',
}

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspect?: AspectRatio;
  variant?: ImageVariant;
}

const LazyImage = ({
  className,
  aspect = AspectRatio.poster,
  variant = ImageVariant.default,
  ...props
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  if (variant === ImageVariant.overlay) {
    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-md">
            <LoadingSpinner className="w-8" />
          </div>
        )}
        <img
          {...props}
          key={props.src}
          loading="lazy"
          className={mergeClassnames('transition-opacity', className)}
          style={{
            visibility: isLoading ? 'hidden' : 'visible',
            opacity: isLoading ? 0 : 1,
          }}
          onLoad={() => setIsLoading(false)}
        />
      </>
    );
  }

  if (variant === ImageVariant.inline) {
    return (
      <div className="relative flex items-center">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded">
            <LoadingSpinner className="w-4" />
          </div>
        )}
        <img
          {...props}
          key={props.src}
          loading="lazy"
          className={mergeClassnames('rounded-xs', className)}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    );
  }

  return (
    <div className={mergeClassnames('relative w-full', aspect)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center overflow-hidden justify-center bg-gray-100">
          <LoadingSpinner className="w-8" />
        </div>
      )}
      <img
        {...props}
        loading="lazy"
        className={mergeClassnames(
          'absolute inset-0 w-full h-full object-cover rounded-sm',
          className
        )}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default LazyImage;
