import { StarIcon } from './Rating/StarIcons';

const Header = () => (
  <div className="h-10 bg-[#5980c7] items-center flex justify-center sticky shadow-sm top-0">
    <div className="font-bold text-white text-2xl mb-1 flex items-center justify-center">
      WI
      <span className="inline-flex items-center -mx-[2px] text-staryellow">
        <StarIcon width={27} />
      </span>
      G
      <span className="font-normal italic ml-2 text-xl">/ Was It Any Good</span>
      <span className="font-medium italic ml-0.5">?</span>
    </div>
  </div>
);

export default Header;
