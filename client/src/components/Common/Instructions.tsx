import { Link } from 'react-router-dom';
import { routerPaths } from '../../utils/url-helper';
import { BrowseResultsType } from '../../../../shared/types/models';
import { PropsWithChildren } from 'react';

interface InstructionsProps {
  linkToSearch?: boolean;
  resultsType?: BrowseResultsType;
}

const Instructions = ({ linkToSearch, resultsType }: InstructionsProps) => {
  if (resultsType === 'votes') {
    return (
      <InstructionsBlock>
        {'Start rating media in WIAG to check your progress!'}
      </InstructionsBlock>
    );
  }
  return (
    <InstructionsBlock>
      <span className="font-medium">
        {'Want to add a Show or Film to WIAG?'}
      </span>
      <span>
        {linkToSearch ? (
          <Link to={routerPaths.search.base}>Search </Link>
        ) : (
          <>Click on it, Search </>
        )}
        <span>{'for it or type its TMDB id in the URL!'}</span>
      </span>
      <span className="text-gray-350 italic cursor-text">
        ({'Example:'}{' '}
        <span className="text-starblue cursor-text">{'/tmdb/show/123'}</span>)
      </span>
    </InstructionsBlock>
  );
};

const InstructionsBlock = ({ children }: PropsWithChildren) => (
  <div className="h-full w-full" aria-hidden="true">
    <span className="text-center flex flex-col align-middle justify-center text-xs sm:text-sm text-gray-400">
      {children}
    </span>
  </div>
);

export default Instructions;
