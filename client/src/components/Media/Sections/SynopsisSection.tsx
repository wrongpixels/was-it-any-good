import { JSX } from 'react';
import { EntryProps } from '../../EntrySection';
import { MediaType } from '../../../../../shared/types/media';
import { DEF_SYNOPSIS } from '../../../../../shared/defaults/media-defaults';
import {
  getMinutesInHourString,
  getYearString,
} from '../../../../../shared/helpers/format-helper';

interface SynopsisSectionProps extends EntryProps {
  mediaType: MediaType;
  episodeCount?: number;
  startDate?: string;
  endDate?: string;
  runtime?: number | null;
}

const SynopsisSections = ({
  title = 'Synopsis',
  content = DEF_SYNOPSIS,
  startDate,
  endDate,
  mediaType,
  runtime,
  episodeCount,
}: SynopsisSectionProps): JSX.Element | null => {
  const isShow: boolean = mediaType === MediaType.Show;
  const displayEpisodes: boolean =
    isShow && episodeCount !== undefined && episodeCount > 0;
  const startYear: string | null = getYearString(startDate) || null;

  const endYear: string = isShow ? getYearString(endDate) || '?' : '';
  const displayDate: boolean = startYear !== null;
  const displayAny: boolean =
    (isShow && (displayDate || displayEpisodes)) ||
    (!isShow && !!runtime && runtime > 0);
  const yearDisplay: string =
    (isShow && endYear === startYear) || (!isShow && startDate)
      ? `${startYear} | `
      : `${startYear} - ${endYear} | `;

  return (
    <div className="mt-2 space-y-2">
      <h2 className="block text-xl font-bold">{title}</h2>
      <p className="text-sm leading-relaxed text-justify flex flex-col">
        <span className="cursor-default text-gray-400 font-extralight">
          {displayAny ? '(' : ''}
          {displayAny && displayDate && yearDisplay}
          {displayEpisodes && (
            <span className="">{`${episodeCount} Episodes`}</span>
          )}
          {!isShow && displayAny && runtime && (
            <span title={`${runtime} minutes`}>
              {getMinutesInHourString(runtime)}
            </span>
          )}
          {displayAny ? ') ' : ''}
        </span>
        <span className="text-regular text-gray-500">
          {content || DEF_SYNOPSIS}
        </span>
      </p>
    </div>
  );
};

export default SynopsisSections;
