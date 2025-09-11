import { Link } from 'react-router-dom';
import IconGitHubLogo from '../Common/Icons/Logos/IconGitHubLogo';
import { styles } from '../../constants/tailwind-styles';
import IconTMDBLogoVert from '../Common/Icons/Logos/IconTMDBLogoVert';
import {
  GITHUB_REPO_URL,
  TMDB_URL,
} from '../../../../shared/constants/url-constants';

const Footer = () => {
  return (
    <footer
      className={`text-sm items-center my-2 cursor-default flex flex-row justify-between ${styles.contentWidth}`}
    >
      <span>
        <Link
          to={GITHUB_REPO_URL}
          target="_blank"
          className="flex flex-row gap-0.5 items-center"
        >
          <IconGitHubLogo height={20} />
          <span className="ml-1">
            <span className="text-gray-500 font-extralight">
              by <span className="font-medium">@</span>
            </span>
            <span className="font-semibold">{'wrongpixels'}</span>
          </span>
        </Link>
      </span>
      <span className="flex flex-row gap-2 items-center">
        <span className="font-medium text-gray-500 text-xs">
          {'Images and data:'}
        </span>
        <IconTMDBLogoVert height={14} url={TMDB_URL} />
      </span>
    </footer>
  );
};

export default Footer;
