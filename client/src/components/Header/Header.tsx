import { Link } from 'react-router-dom';
import HeaderLogin from './HeaderLogin';
import StarIcon from '../common/icons/Rating/StarIcon';
import SearchField from './Search/SearchField';
import { styles } from '../../constants/tailwind-styles';

const Header = () => {
  return (
    <span className={`sticky top-0 z-50`}>
      <span className="h-11 bg-[#5980c7] flex flex-col shadow-sm py-1">
        <span className="relative flex flex-row w-5xl items-center mx-auto">
          <span className="absolute left-0  z-51">
            <SearchField />
          </span>

          <Link to="/" className="mx-auto">
            <span
              className={`font-bold text-white text-2xl flex items-center pb-1  ${styles.shadow.textShadow}`}
            >
              {'WI'}
              <span className="inline-flex items-center -mx-[2px] text-staryellow">
                <StarIcon width={27} />
              </span>
              {'G'}
              <span className="font-normal italic ml-2 text-xs mt-1 text-amber-100">
                {'Was It Any Good'}
              </span>
              <span className="font-medium italic ml-0.5 text-xl mt-1">?</span>
            </span>
          </Link>
          <span className="absolute right-0">
            <HeaderLogin />
          </span>
        </span>
      </span>
      <span className="absolute top-11 bg-black/15 w-full h-0.5 shadow-sm shadow-black/20" />
    </span>
  );
};

export default Header;
