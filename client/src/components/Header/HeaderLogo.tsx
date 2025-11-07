import { Link } from 'react-router-dom';
import { styles } from '../../constants/tailwind-styles';
import { OptClassNameProps } from '../../types/common-props-types';
import { clientPaths } from '../../../../shared/util/url-builder';
import IconWIAGLogo from '../Common/Icons/Logos/IconWIAGLogo';
import IconWIAGLogoImage from '../Common/Icons/Logos/IconWIAGImage';

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
          <div
            className={
              'flex flex-row pt-1 opacity-95 hover:brightness-105 hover:saturate-75 hover:opacity-100 transition-all'
            }
          >
            <IconWIAGLogoImage className={'drop-shadow-xs/50'} />
            <span className="font-normal italic ml-2 text-xs text-staryellow-bright/90 hidden sm:inline pt-0.5">
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
