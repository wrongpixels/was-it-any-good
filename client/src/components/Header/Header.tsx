import { Link } from 'react-router-dom';
import HeaderLogin from './HeaderLogin';
import StarIcon from '../Rating/StarIcon';

const Header = () => {
  return (
    <div>
      <div className="h-10 bg-[#5980c7] sticky shadow-sm top-0 flex justify-center items-center">
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
        <HeaderLogin />
      </div>
    </div>
  );
};

export default Header;
