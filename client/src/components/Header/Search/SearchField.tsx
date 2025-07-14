import { JSX, useEffect, useState } from 'react';
import { useInputField } from '../../../hooks/use-inputfield';
import SearchIcon from './Icons/SearchIcon';
import { IndexMediaData } from '../../../../../shared/types/models';
import { DEF_IMAGE_MEDIA } from '../../../../../shared/defaults/media-defaults';
import { MediaType } from '../../../../../shared/types/media';
import FilmIcon from './Icons/FilmIcon';
import ShowIcon from './Icons/ShowIcon';
import Separator from '../../common/Separator';
import useListNavigation from '../../../hooks/use-list-navigation';
import useHoverChecker from '../../../hooks/use-hover-checker';

const testSearch: IndexMediaData[] = [
  {
    id: 1,
    name: 'Crimson Peak',
    image: DEF_IMAGE_MEDIA,
    addedToMedia: true,
    rating: 8,
    year: 2015,
    baseRating: 8,
    voteCount: 1,
    popularity: 43434,
    mediaType: MediaType.Show,
    tmdbId: 156,
    mediaId: null,
  },
  {
    id: 2,
    name: 'The Midnight Library',
    image: DEF_IMAGE_MEDIA,
    addedToMedia: false,
    rating: 7,
    year: 2020,
    baseRating: 7,
    voteCount: 15,
    popularity: 12345,
    mediaType: MediaType.Film,
    tmdbId: 201,
    mediaId: 98765,
  },
  {
    id: 3,
    name: 'Eternal Sunshine',
    image: DEF_IMAGE_MEDIA,
    addedToMedia: true,
    rating: 9,
    year: 2004,
    baseRating: 9,
    voteCount: 23,
    popularity: 98765,
    mediaType: MediaType.Show,
    tmdbId: 302,
    mediaId: null,
  },
  {
    id: 4,
    name: 'Whispers of the Heart',
    image: DEF_IMAGE_MEDIA,
    addedToMedia: false,
    rating: 6,
    year: 1995,
    baseRating: 6,
    voteCount: 5,
    popularity: 54321,
    mediaType: MediaType.Film,
    tmdbId: 403,
    mediaId: 11223,
  },
  {
    id: 5,
    name: 'Digital Fortress',
    image: DEF_IMAGE_MEDIA,
    addedToMedia: true,
    rating: 8,
    year: 1998,
    baseRating: 8,
    voteCount: 10,
    popularity: 67890,
    mediaType: MediaType.Show,
    tmdbId: 504,
    mediaId: null,
  },
  {
    id: 6,
    name: 'The Silent Patient',
    image: DEF_IMAGE_MEDIA,
    addedToMedia: true,
    rating: 7,
    year: 2019,
    baseRating: 7,
    voteCount: 18,
    popularity: 23456,
    mediaType: MediaType.Film,
    tmdbId: 605,
    mediaId: 54321,
  },
  {
    id: 7,
    name: 'Project Hail Mary',
    image: DEF_IMAGE_MEDIA,
    addedToMedia: false,
    rating: 9,
    year: 2021,
    baseRating: 9,
    voteCount: 30,
    popularity: 87654,
    mediaType: MediaType.Show,
    tmdbId: 706,
    mediaId: null,
  },
  {
    id: 8,
    name: 'Where the Crawdads Sing',
    image: DEF_IMAGE_MEDIA,
    addedToMedia: true,
    rating: 7,
    year: 2022,
    baseRating: 7,
    voteCount: 12,
    popularity: 34567,
    mediaType: MediaType.Film,
    tmdbId: 807,
    mediaId: 76543,
  },
  {
    id: 9,
    name: 'The Great Alone',
    image: DEF_IMAGE_MEDIA,
    addedToMedia: false,
    rating: 8,
    year: 2018,
    baseRating: 8,
    voteCount: 9,
    popularity: 90123,
    mediaType: MediaType.Show,
    tmdbId: 908,
    mediaId: null,
  },
  {
    id: 10,
    name: 'Pillars of the Earth',
    image: DEF_IMAGE_MEDIA,
    addedToMedia: true,
    rating: 9,
    year: 2010,
    baseRating: 9,
    voteCount: 25,
    popularity: 10987,
    mediaType: MediaType.Film,
    tmdbId: 1009,
    mediaId: 22334,
  },
];

const getIconByType = (mediaType: MediaType): JSX.Element | null => {
  switch (mediaType) {
    case MediaType.Film:
      return <FilmIcon />;
    case MediaType.Show:
      return <ShowIcon />;
    default:
      return null;
  }
};

interface SelectedLineProps {
  active?: boolean;
}

const SelectedLine = ({ active }: SelectedLineProps): JSX.Element | null => {
  if (!active) return null;
  return (
    <div
      className="absolute inset-y-0 -left-0.5 bg-current text-starblue"
      style={{ width: 3 }}
    />
  );
};

interface SearchPosterProps {
  imageSrc: string | null;
}

const SearchPoster = ({ imageSrc }: SearchPosterProps): JSX.Element | null => {
  if (!imageSrc) return null;
  return (
    <div className="bg-white border-5 border-white rounded-sm shadow-sm ring-1 ring-gray-300">
      <img
        src={imageSrc}
        className="h-40 w-auto object-contain rounded-md"
        alt=""
      />
    </div>
  );
};

interface FirstSearchRowProps {
  searchValue: string;
  isSelected: boolean;
  onHover: (isHovering: boolean) => void;
}

const FirstSearchRow = ({
  searchValue,
  isSelected,
  onHover,
}: FirstSearchRowProps): JSX.Element => {
  const [ref, isHovered] = useHoverChecker();

  useEffect(() => {
    onHover(isHovered);
  }, [isHovered, onHover]);

  const isActive = isSelected || isHovered;

  return (
    <div
      ref={ref}
      key="last-search"
      className={`flex flex-row items-center font-medium relative px-1.5 py-0.5 rounded-lg ${isActive ? 'bg-blue-50 text-cyan-850' : ''}`}
    >
      <SelectedLine active={isSelected} />
      <span className="ml-1">
        <SearchIcon />
      </span>
      <div>
        <span className="font-light pl-1">
          Search for "<span className="font-semibold">{searchValue}</span>"
        </span>
      </div>
    </div>
  );
};

interface SearchRowProps {
  indexMedia: IndexMediaData;
  isSelected: boolean;
  onHover: (isHovering: boolean) => void;
}

const SearchRow = ({
  indexMedia,
  isSelected,
  onHover,
}: SearchRowProps): JSX.Element => {
  const [ref, isHovered] = useHoverChecker();

  useEffect(() => {
    onHover(isHovered);
  }, [isHovered, onHover]);

  const isActive = isSelected || isHovered;

  return (
    <div
      ref={ref}
      className={`flex flex-row gap-2 items-center px-1.5 py-0.5 relative font-medium rounded-lg ${isActive ? 'bg-amber-50 text-cyan-900' : ''}`}
    >
      <SelectedLine active={isSelected} />
      {getIconByType(indexMedia.mediaType)}
      <div>
        {indexMedia.name}
        <span className="font-light pl-1">({indexMedia.year})</span>
      </div>
    </div>
  );
};

interface SearchResultsProps {
  searchValue: string;
  onClose: () => void;
}

const SearchResults = ({
  searchValue,
  onClose,
}: SearchResultsProps): JSX.Element | null => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const totalItems = testSearch.length + 1;
  const { activeIndex, ref } = useListNavigation({
    maxIndex: totalItems,
    onEsc: onClose,
  });

  let posterToShow: IndexMediaData | null = null;
  if (activeIndex > 0 && activeIndex <= testSearch.length) {
    posterToShow = testSearch[activeIndex - 1];
  } else if (hoveredIndex !== null && hoveredIndex > 0) {
    posterToShow = testSearch[hoveredIndex - 1];
  }

  return (
    <div className="flex flex-row gap-2 items-center" ref={ref}>
      <div className="bg-white border-3 flex flex-col border-white rounded-lg ring-1 ring-gray-300 shadow-lg cursor-pointer text-[15px] text-gray-500">
        <FirstSearchRow
          searchValue={searchValue}
          isSelected={activeIndex === 0}
          onHover={(isHovering) => setHoveredIndex(isHovering ? 0 : null)}
        />
        <Separator margin={false} />
        {testSearch.map((mediaItem, index) => {
          const itemIndex = index + 1;
          return (
            <SearchRow
              key={mediaItem.id}
              indexMedia={mediaItem}
              isSelected={itemIndex === activeIndex}
              onHover={(isHovering) => {
                setHoveredIndex((prev) =>
                  isHovering ? itemIndex : prev === itemIndex ? null : prev
                );
              }}
            />
          );
        })}
      </div>
      <span>
        <SearchPoster imageSrc={posterToShow?.image ?? null} />
      </span>
    </div>
  );
};

const SearchField = (): JSX.Element => {
  const [isDropdownVisible, setDropdownVisible] = useState(true);
  const searchField = useInputField({
    name: 'search',
    placeholder: 'Films, shows...',
    extraClassNames: 'pl-7',
  });

  useEffect(() => {
    if (searchField.value) {
      setDropdownVisible(true);
    }
  }, [searchField.value]);

  return (
    <div className="flex gap-2">
      <span className="absolute text-gray-400 ml-0.5 mt-0.5 items-center">
        <SearchIcon active={!!searchField.value} />
      </span>
      {searchField.field}
      {searchField.value && isDropdownVisible && (
        <div className="absolute translate-y-7 -translate-x-2.5">
          <SearchResults
            searchValue={searchField.value}
            onClose={() => setDropdownVisible(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SearchField;
