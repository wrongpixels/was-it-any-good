import HeaderLogin from './HeaderLogin';
import SearchField from './Search/SearchField';
import { useState } from 'react';
import HeaderLogo from './HeaderLogo';

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
      <div className="h-11 bg-[#5980c7] shadow-md/15">
        <div className="relative flex h-full w-full max-w-5xl items-center justify-between mx-auto px-4">
          <div className="flex-1 flex justify-start">
            <div className="hidden md:block">
              <SearchField fieldName="header" />
            </div>
          </div>
          <HeaderLogo
            className={
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
            }
          />
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
            <SearchField fieldName="header" />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
