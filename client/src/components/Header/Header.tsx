import { Link } from 'react-router-dom';
import HeaderLogin from './HeaderLogin';
import StarIcon from '../common/icons/Rating/StarIcon';
import SearchField from './Search/SearchField';
import { styles } from '../../constants/tailwind-styles';
import { useState } from 'react';

const HamburgerIcon = () => (
  <svg
    className="w-6 h-6 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16m-7 6h7"
    />
  </svg>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="h-11 bg-[#5980c7] shadow-sm">
        <div className="relative flex h-full w-full max-w-5xl items-center justify-between mx-auto px-4">
          <div className="flex-1 flex justify-start">
            <div className="hidden md:block">
              <SearchField />
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="flex items-center flex-shrink-0">
              <span
                className={`font-bold text-white text-2xl flex items-center pb-1 ${styles.shadow.textShadow}`}
              >
                {'WI'}
                <span className="inline-flex items-center -mx-[2px] text-staryellow">
                  <StarIcon width={27} />
                </span>
                {'G'}
                <span className="font-normal italic ml-2 text-xs mt-1 text-amber-100 hidden sm:inline">
                  {'Was It Any Good'}
                </span>
                <span className="font-medium italic ml-0.5 text-xl mt-1 hidden sm:inline">
                  ?
                </span>
              </span>
            </Link>
          </div>

          <div className="flex-1 flex justify-end">
            <div className="hidden lg:block">
              <HeaderLogin />
            </div>
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                <HamburgerIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute w-full bg-[#5980c7] shadow-lg md:hidden">
          <div className="p-4 flex flex-col gap-4">
            <HeaderLogin />
            <SearchField />
          </div>
        </div>
      )}

      <div className="absolute top-11 bg-black/15 w-full h-0.5 shadow-sm shadow-black/20" />
    </header>
  );
};

export default Header;
