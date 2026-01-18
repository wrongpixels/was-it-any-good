import { JSX, PropsWithChildren, useState } from 'react';
import { useInputField } from '../../hooks/use-input-field';
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
import { TextArea } from '../Common/Custom/TextArea';
import { useTextArea } from '../../hooks/use-text-area';

const SHOW_REVIEW_FORM: boolean = true;

interface UserReviewFormProps {
  media: MediaResponse | ShowResponse;
}

const UserReviewForm = ({ media }: UserReviewFormProps): JSX.Element | null => {
  if (!SHOW_REVIEW_FORM) {
    return null;
  }
  const isAShow: boolean = isShow(media);
  const seasonNames: string[] =
    isShow(media) && media.seasons
      ? getVisibleSeasons(media.seasons).map((s: SeasonResponse) => s.name)
      : [];
  const [addSpoilers] = useState<boolean>(true);
  const titleField = useInputField({
    name: 'title',
    placeholder: 'Your title...',
    rules: {
      minLength: 3,
      maxLength: 75,
      visualValidation: true,
    },
  });
  const reviewTextArea = useTextArea({
    name: 'title',
    placeholder: 'Your spoiler-free review...',
    rules: {
      minLength: 30,
      maxLength: 6000,
      visualValidation: true,
    },
  });
  const spoilerTextArea = useTextArea({
    name: 'title',
    placeholder: 'Your spoiler review...',
    rules: {
      minLength: 30,
      maxLength: 4000,
      visualValidation: true,
    },
  });
  return (
    <form className="pl-2 flex flex-col">
      <Section>
        {'Reviewing'}
        <div
          className={`flex flex-col items-start gap-2 ${isAShow ? 'pt-1' : 'pt-1.5'}`}
        >
          {isAShow && (
            <Dropdown
              options={[...seasonNames, 'Full show']}
              defaultValue={'Full show'}
            />
          )}
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
      <TextArea {...reviewTextArea.getProps()} />
      {addSpoilers && (
        <>
          <Section>
            {'Spoilers'}
            <div className="text-sm font-normal">
              {'You can write freely here, users will be warned!'}
            </div>
          </Section>
          <TextArea {...spoilerTextArea.getProps()} />
        </>
      )}
      <AnimatedDiv
        animKey="submit-user-review-button"
        className="flex justify-center"
      >
        <Button
          disabled={!titleField.value || !reviewTextArea.isSuccess}
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
