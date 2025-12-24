import { JSX, useState } from 'react';
import { useInputField } from '../../hooks/use-inputfield';
import { InputField } from '../Common/Custom/InputField';

const SHOW_REVIEW_FORM: boolean = false;

const UserReviewForm = (): JSX.Element | null => {
  if (!SHOW_REVIEW_FORM) {
    return null;
  }
  const [mainTextContent, setMainTextContent] = useState<string>('');
  const [addSpoilers, setAddSpoilers] = useState<boolean>(false);
  const titleField = useInputField({
    name: 'title',
    placeholder: 'Title',
    rules: {
      minLength: 3,
      maxLength: 75,
      visualValidation: true,
    },
  });
  return (
    <form className="pl-2">
      <InputField {...titleField.getProps()} className={'h-8 w-3xs'} />
      <h2>{'Your spoiler-free review'}</h2>
      <textarea
        className="w-full pl-1 py-0.5 pr-2 ring-cyan-400 border-none rounded ring-1 bg-white text-gray-800 text-sm hover:ring-amber-300 focus:outline-none focus:ring-2 focus:ring-starblue"
        value={mainTextContent}
        placeholder={'Your review...'}
        onChange={(e) => setMainTextContent(e.target.value)}
      />
      {'Add a Spoiler section?'}
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
          {'No'}{' '}
          <input
            type="radio"
            name="spoiler"
            value="No"
            checked={!addSpoilers}
            onChange={() => setAddSpoilers(false)}
          />
        </span>
      </div>
    </form>
  );
};

export default UserReviewForm;
