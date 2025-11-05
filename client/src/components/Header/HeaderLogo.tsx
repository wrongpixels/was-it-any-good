import { Link } from 'react-router-dom';
import { styles } from '../../constants/tailwind-styles';
import { OptClassNameProps } from '../../types/common-props-types';
import IconStarLogo from '../Common/Icons/Logos/IconStarLogo';
import { clientPaths } from '../../../../shared/util/url-builder';
import IconWIAGLogoImage from '../Common/Icons/Logos/IconWIAGImage';
import IconWIAGLogo from '../Common/Icons/Logos/IconWIAGLogo';

const HeaderLogo = (props: OptClassNameProps) => {
  return (
    <div {...props}>
      <Link
        to={`${clientPaths.home}`}
        className="flex items-center flex-shrink-0"
        title="Home / Search"
      >
        <div
          className={`font-bold text-white text-2xl flex flex-row items-center pb-1 ${styles.shadow.textShadow}`}
        >
          <div className="flex flex-row pt-1">
            <IconWIAGLogo className="drop-shadow-xs/40 opacity-90" />
            <span className="font-normal italic ml-2 text-xs text-amber-200 hidden sm:inline pt-0.5">
              {'Was It Any Good'}
              <span className="font-medium italic ml-0.5 hidden sm:inline text-white">
                {'?'}
              </span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HeaderLogo;
