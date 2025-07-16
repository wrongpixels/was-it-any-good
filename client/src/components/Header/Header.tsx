import { Link } from 'react-router-dom';
import HeaderLogin from './HeaderLogin';
import StarIcon from '../Rating/StarIcon';
import SearchField from './Search/SearchField';

const Header = () => {
  return (
    <div className="h-10 bg-[#5980c7] sticky shadow-sm top-0 flex z-99">
      <div className="relative flex flex-row w-5xl items-center mx-auto">
        <div className="absolute left-0">
          <SearchField />
        </div>

        <Link to="/" className="mx-auto">
          <div className="font-bold text-white text-2xl flex items-center pb-1">
            WI
            <span className="inline-flex items-center -mx-[2px] text-staryellow">
              <StarIcon width={27} />
            </span>
            G
            <span className="font-normal italic ml-2 text-xs mt-1 text-amber-100">
              Was It Any Good
            </span>
            <span className="font-medium italic ml-0.5 text-xl mt-1">?</span>
          </div>
        </Link>

        <div className="absolute right-0">
          <HeaderLogin />
        </div>
      </div>
    </div>
  );
};

export default Header;
