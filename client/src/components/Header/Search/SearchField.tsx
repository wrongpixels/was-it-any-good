import { JSX } from 'react';
import { useInputField } from '../../../hooks/use-inputfield';
import SearchIcon from './Icons/SearchIcon';
import { IndexMediaData } from '../../../../../shared/types/models';
import { DEF_IMAGE_MEDIA } from '../../../../../shared/defaults/media-defaults';
import { MediaType } from '../../../../../shared/types/media';
import FilmIcon from './Icons/FilmIcon';
import ShowIcon from './Icons/ShowIcon';
import Separator from '../../common/Separator';

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
interface SearchProps {
  searchValue: string;
}
const SearchResults = ({ searchValue }: SearchProps): JSX.Element => {
  return (
    <div className=" bg-white border-3 flex flex-col gap-0.5 border-white rounded-lg ring-1 ring-gray-300 shadow-lg cursor-pointer text-[15px] text-gray-500">
      {testSearch.map((im: IndexMediaData) => (
        <SearchRow indexMedia={im} />
      ))}
      <Separator margin={false} />
      <LastSearchRow searchValue={searchValue} />
    </div>
  );
};

interface SearchRowProps {
  indexMedia: IndexMediaData;
}

const SearchRow = ({ indexMedia }: SearchRowProps): JSX.Element => (
  <div
    key={indexMedia.id}
    className="flex flex-row gap-2 items-center px-1 py-0.5 font-medium hover:bg-amber-50 hover:text-cyan-950"
  >
    {getIconByType(indexMedia.mediaType)}
    <div>
      {indexMedia.name}
      <span className="font-light pl-1">({indexMedia.year})</span>
    </div>
  </div>
);

const LastSearchRow = ({ searchValue }: SearchProps): JSX.Element => (
  <div
    key="last-search"
    className="flex flex-row gap-2 items-center px-1 py-0.5 font-medium hover:bg-blue-50 hover:text-cyan-950"
  >
    <div>
      <span className="font-light pl-1">
        Search for "<span className="font-semibold">{searchValue}</span>"
      </span>
    </div>
  </div>
);

const SearchField = (): JSX.Element => {
  const searchField = useInputField({
    name: 'search',
    placeholder: 'Films, shows...',
    extraClassNames: 'pl-7',
  });
  return (
    <div className="flex gap-2">
      <span className="absolute text-gray-400 ml-0.5 mt-0.5 items-center">
        <SearchIcon />
      </span>
      {searchField.field}
      {searchField.value && (
        <div className="absolute translate-y-7 -translate-x-2">
          <SearchResults searchValue={searchField.value} />
        </div>
      )}
    </div>
  );
};
export default SearchField;
