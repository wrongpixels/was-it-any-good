import { Link } from 'react-router-dom';
import IconStar from '../common/icons/rating/IconStar';
import { styles } from '../../constants/tailwind-styles';
import { OptClassNameProps } from '../../types/common-props-types';
import { routerPaths } from '../../utils/url-helper';

const HeaderLogo = (props: OptClassNameProps) => {
  return (
    <div {...props}>
      <Link
        to={`${routerPaths.home}`}
        className="flex items-center flex-shrink-0"
        title="Home / Search"
      >
        <span
          className={`font-bold text-white text-2xl flex items-center pb-1 ${styles.shadow.textShadow}  ${styles.animations.zoomLessOnHover}`}
        >
          {'WI'}
          <span className="inline-flex items-center -mx-[2px] text-staryellow">
            <IconStar width={27} />
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
  );
};

export default HeaderLogo;
