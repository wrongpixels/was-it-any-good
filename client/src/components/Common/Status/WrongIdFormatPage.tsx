import { setTitle } from '../../../utils/page-info-setter';

const WrongIdFormatPage = () => {
  setTitle('Wrong id format');

  return (
    <div className="flex flex-col items-center justify-center w-full font-medium text-2xl gap-4 whitespace-pre-line mt-8">
      {'Wrong ID format!'}
      <div className="text-gray-400 text-base font-normal">
        {'Ids can only have numbers'}
      </div>
    </div>
  );
};

export default WrongIdFormatPage;
