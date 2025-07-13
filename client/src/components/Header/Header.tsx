import { Link } from 'react-router-dom';
import HeaderLogin from './HeaderLogin';
import StarIcon from '../Rating/StarIcon';
import SearchField from './SearchField';

const Header = () => {
  return (
    <div className="h-10 bg-[#5980c7] sticky shadow-sm top-0 flex ">
      <div className="flex flex-row w-5xl justify-between items-center mx-auto">
        <SearchField />
        <Link to="/">
          <div className="font-bold text-white text-2xl flex items-center pb-1">
            WI
            <span className="inline-flex items-center -mx-[2px] text-staryellow">
              <StarIcon width={27} />
            </span>
            G
            <span className="font-normal italic ml-2 text-base mt-1 text-amber-100">
              Was It Any Good
            </span>
            <span className="font-medium italic ml-0.5 text-xl mt-1">?</span>
          </div>
        </Link>
        <span className="right-1">
          <HeaderLogin />
        </span>
      </div>
    </div>
  );
};

export default Header;
