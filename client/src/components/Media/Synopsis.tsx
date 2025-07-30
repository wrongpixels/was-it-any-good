import { JSX } from 'react';
import { EntryProps } from '../EntrySection';
import { MediaType } from '../../../../shared/types/media';
import { DEF_SYNOPSIS } from '../../../../shared/defaults/media-defaults';
import { getYearString } from '../../../../shared/helpers/format-helper';

interface SynopsisProps extends EntryProps {
  mediaType: MediaType;
  episodeCount?: number;
  startDate?: string;
  endDate?: string;
}

const Synopsis = ({
  title = 'Synopsis',
  content = DEF_SYNOPSIS,
  startDate,
  endDate,
  mediaType,
  episodeCount,
}: SynopsisProps): JSX.Element | null => {
  if (!title || !content) {
    return null;
  }
  const isShow: boolean = mediaType === MediaType.Show;
  const displayEpisodes: boolean =
    isShow && episodeCount !== undefined && episodeCount > 0;
  const startYear: string | null = isShow
    ? getYearString(startDate) || null
    : null;
  const endYear: string = isShow ? getYearString(endDate) || '?' : '';
  const displayDate: boolean = startYear !== null;
  const displayAny: boolean = isShow && (displayDate || displayEpisodes);

  return (
    <div className="mt-2 space-y-2">
      <h2 className="block text-xl font-bold">{title}</h2>
      <p className="text-sm leading-relaxed text-justify flex flex-col">
        <span className=" text-gray-400 font-extralight">
          {displayAny ? '(' : ''}
          {displayDate && `${startYear} - ${endYear} | `}
          {displayEpisodes && (
            <span className="font-normal text-gray-450">{`${episodeCount} Episodes`}</span>
          )}
          {displayAny ? '.) ' : ''}
        </span>
        <span className="text-regular text-gray-500">{content}</span>
      </p>
    </div>
  );
};

export default Synopsis;
