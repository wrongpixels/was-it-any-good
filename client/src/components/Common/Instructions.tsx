import { Link } from 'react-router-dom';
import {
  BrowseResultsType,
  UserListValues,
} from '../../../../shared/types/models';
import { PropsWithChildren } from 'react';
import { clientPaths } from '../../../../shared/util/url-builder';

interface InstructionsProps {
  linkToSearch?: boolean;
  resultsType?: BrowseResultsType;
  userListValues?: UserListValues;
}

const Instructions = ({
  linkToSearch,
  resultsType,
  userListValues,
}: InstructionsProps) => {
  if (userListValues) {
    return (
      <InstructionsBlock>
        {'Add media to start keeping track of your watch progress'}
      </InstructionsBlock>
    );
  }
  if (resultsType === 'votes') {
    return (
      <InstructionsBlock>
        {'Start rating media in WIAG to check your progress!'}
      </InstructionsBlock>
    );
  }
  return (
    <InstructionsBlock>
      <span className="font-medium text-[16px]">
        {'Want to add a Show or Film to WIAG?'}
      </span>
      <span>
        {linkToSearch ? (
          <>
            {'Just '}
            <Link to={clientPaths.search.base}>{'Search '}</Link>
          </>
        ) : (
          <>
            {'Just'}
            <span className="font-semibold">{' Search '}</span>
          </>
        )}
        <>
          {' for it by '}
          <span className="font-semibold">{'Title'}</span>
          {' or '}
          <span className="font-semibold">{'TMDB ID'}</span>
          {'!'}
        </>
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
