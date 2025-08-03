import { Link } from 'react-router-dom';
import { CreditResponse, MergedCredits } from '../../../../shared/types/models';
import imageLinker from '../../../../shared/util/image-linker';
import { styles } from '../../constants/tailwind-styles';
import { isMerged } from '../../utils/credits-merger';
import LazyImage, { ImageVariant } from '../common/LazyImage';
import { routerPaths } from '../../utils/url-helper';
import React from 'react';

const getExtraInfo = (person: CreditResponse | MergedCredits): string =>
  isMerged(person)
    ? person.mergedRoles.join(', ')
    : person.characterName?.join(', ').replace(' (voice)', '') || 'Unknown';

interface MediaPersonPosterProps {
  credit: CreditResponse | MergedCredits;
}

const MediaPersonPoster = ({ credit }: MediaPersonPosterProps) => {
  const extraInfo: string = getExtraInfo(credit);
  return (
    <Link
      to={routerPaths.people.byId(credit.person.id)}
      key={credit.person.id}
      className={`flex-shrink-0 flex flex-col items-center shadow-md rounded p-1 pt-2 ring-1 ring-gray-300 ${styles.animations.upOnHoverShort} ${styles.animations.zoomLessOnHover} ${styles.gradient.poster}`}
    >
      <LazyImage
        variant={ImageVariant.inline}
        src={imageLinker.getAvatarImage(credit.person.image)}
        alt={credit.person.name}
        title={credit.person.name}
        className="w-26 rounded h-auto shadow ring-1 ring-gray-300"
        loading="lazy"
      />
      <div className="w-28 flex flex-col items-center text-center pt-1 pb-1 flex-grow">
        <div className="flex-grow flex items-center justify-center px-0.5">
          <div className="flex flex-col items-center gap-1">
            <div
              className="font-medium text-sm leading-tight break-words line-clamp-2"
              title={credit.person.name}
            >
              {credit.person.name}
            </div>
            <div
              className="text-gray-500 text-xs font-normal leading-tight line-clamp-2"
              title={extraInfo}
            >
              {extraInfo}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(MediaPersonPoster);
