import { Link } from 'react-router-dom';
import { styles } from '../../constants/tailwind-styles';
import { OptClassNameProps } from '../../types/common-props-types';
import { routerPaths } from '../../utils/url-helper';
import IconStarLogo from '../Common/Icons/Logos/IconStarLogo';

const HeaderLogo = (props: OptClassNameProps) => {
  return (
    <div {...props}>
      <Link
        to={`${routerPaths.home}`}
        className="flex items-center flex-shrink-0"
        title="Home / Search"
      >
        <span
          className={`font-bold text-white text-2xl flex items-baseline pb-1 ${styles.shadow.textShadow}`}
        >
          <span className="flex flex-row items-center">
            {'WI'}
            <span className="flex items-center -mx-[2px] text-staryellow drop-shadow mt-0.5">
              <IconStarLogo width={26} />
            </span>
            {'G'}
          </span>
          <span className="font-normal italic ml-2 text-xs mt-1 text-amber-200 hidden sm:inline">
            {'Was It Any Good'}
          </span>
          <span className="font-medium italic ml-0.5 text-sm mt-1 hidden sm:inline">
            {'?'}
          </span>
        </span>
      </Link>
    </div>
  );
};

export default HeaderLogo;
