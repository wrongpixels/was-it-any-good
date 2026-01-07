import { JSX, PropsWithChildren, useState } from 'react';
import { useInputField } from '../../hooks/use-inputfield';
import { InputField } from '../Common/Custom/InputField';
import Button from '../Common/Custom/Button';
import IconCreate from '../Common/Icons/IconCreate';
import { AnimatedDiv } from '../Common/Custom/AnimatedDiv';
import {
  MediaResponse,
  SeasonResponse,
  ShowResponse,
} from '../../../../shared/types/models';
import Dropdown from '../Common/Custom/Dropdown';
import { isShow } from '../../../../shared/helpers/media-helper';
import { getVisibleSeasons } from '../../utils/seasons-setter';
import SearchCard from '../Search/Cards/SearchCard';
import { BadgeType } from '../../types/search-browse-types';

const SHOW_REVIEW_FORM: boolean = true;

interface UserReviewFormProps {
  media: MediaResponse | ShowResponse;
}

const UserReviewForm = ({ media }: UserReviewFormProps): JSX.Element | null => {
  if (!SHOW_REVIEW_FORM) {
    return null;
  }
  const seasonNames: string[] =
    isShow(media) && media.seasons
      ? getVisibleSeasons(media.seasons).map((s: SeasonResponse) => s.name)
      : [];
  const [mainTextContent, setMainTextContent] = useState<string>('');
  const [spoilerContent, setSpoilerContent] = useState<string>('');
  const [addSpoilers, setAddSpoilers] = useState<boolean>(false);
  const titleField = useInputField({
    name: 'title',
    placeholder: 'Your title...',
    rules: {
      minLength: 3,
      maxLength: 75,
      visualValidation: true,
    },
  });
  return (
    <form className="pl-2 flex flex-col">
      <Section>
        {'Reviewing '}
        <div className="flex flex-col items-start gap-2">
          <Dropdown
            options={[...seasonNames, 'Full show']}
            defaultValue={'Full show'}
          />
          {media && (
            <SearchCard
              media={media.indexMedia}
              index={0}
              badgeType={BadgeType.None}
              canBeClicked={false}
            />
          )}
        </div>
      </Section>
      <Section>
        {'Title your review'}
        <span className="font-normal italic">{' (required)'}</span>
      </Section>
      <InputField {...titleField.getProps()} className={'h-8 w-3xs'} />
      <Section>
        {'Review'}
        <span className="font-normal italic">{' (without spoilers)'}</span>
        <div className="text-sm font-normal">
          {`All users can see this, so don't spoil anything!`}
        </div>
      </Section>
      <textarea
        className="w-full pl-1 py-0.5 pr-2 ring-cyan-400 border-none rounded ring-1 bg-white text-gray-800 text-sm hover:ring-amber-300 focus:outline-none focus:ring-2 focus:ring-starblue min-h-30"
        value={mainTextContent}
        placeholder={'Your spoiler-free review...'}
        onChange={(e) => setMainTextContent(e.target.value)}
      />
      <Section>{'Add spoiler section?'}</Section>
      <div className="flex flex-row gap-3">
        <span className="flex flex-row gap-2">
          {'Yes'}
          <input
            type="radio"
            name="spoiler"
            value="Yes"
            checked={addSpoilers}
            onChange={() => setAddSpoilers(true)}
          />
        </span>
        <span className="flex flex-row gap-2">
          {'No'}
          <input
            type="radio"
            name="spoiler"
            value="No"
            checked={!addSpoilers}
            onChange={() => setAddSpoilers(false)}
          />
        </span>
      </div>
      {addSpoilers && (
        <>
          <Section>
            {'Spoilers'}
            <div className="text-sm font-normal">
              {'You can write freely here, users will be warned!'}
            </div>
          </Section>
          <textarea
            className="w-full pl-1 py-0.5 pr-2 ring-cyan-400 border-none rounded ring-1 bg-white text-gray-800 text-sm hover:ring-amber-300 focus:outline-none focus:ring-2 focus:ring-starblue min-h-30"
            value={spoilerContent}
            placeholder={'Your spoiler review...'}
            onChange={(e) => setSpoilerContent(e.target.value)}
          />
        </>
      )}
      <AnimatedDiv
        animKey="submit-user-review-button"
        className="flex justify-center"
      >
        <Button
          disabled={!titleField.value || !mainTextContent}
          type="submit"
          className="relative mt-2 w-32 justify-center pl-5"
        >
          {'Send review'}
          <span className="absolute w-full ">
            <IconCreate width={16} />
          </span>
        </Button>
      </AnimatedDiv>
    </form>
  );
};

const Section = ({ children }: PropsWithChildren): JSX.Element => {
  return <h2 className="pt-3 pb-1 font-semibold">{children}</h2>;
};

export default UserReviewForm;
