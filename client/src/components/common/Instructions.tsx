import { Link } from 'react-router-dom';
import { OptBoolProps } from '../../types/common-props-types';
import { routerPaths } from '../../utils/url-helper';

const Instructions = ({ condition: linkToSearch }: OptBoolProps) => {
  return (
    <span className="text-center flex flex-col align-middle justify-center text-sm text-gray-400">
      <span className="font-medium">
        {'Want to add a Show or Film to WIAG?'}
      </span>
      <span>
        {linkToSearch ? (
          <Link to={routerPaths.search.base}>Search </Link>
        ) : (
          <>Search </>
        )}
        <span>{'for it or type its TMDB id in the URL!'}</span>
      </span>
      <span className="text-gray-350 italic">
        ({'Example:'} <span className="text-starblue">{'/tmdb/show/123'}</span>)
      </span>
    </span>
  );
};

export default Instructions;
