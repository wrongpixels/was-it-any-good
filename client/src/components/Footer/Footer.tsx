import { Link } from 'react-router-dom';
import GitHubLogo from '../common/icons/logos/IconGitHubLogo';

const Footer = () => {
  return (
    <footer className="text-sm text-left items-center w-5xl my-2 cursor-default ml-10">
      <Link
        to={'https://github.com/wrongpixels'}
        target="_blank"
        className="flex flex-row gap-0.5"
      >
        <GitHubLogo height={20} />{' '}
        <span className="ml-1">
          <span className="text-gray-500 font-extralight">
            by <span className="font-medium">@</span>
          </span>
          <span className="font-semibold">{'wrongpixels'}</span>
        </span>
      </Link>
    </footer>
  );
};

export default Footer;
