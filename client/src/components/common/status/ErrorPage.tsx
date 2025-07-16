import { setTitle } from '../../../utils/page-info-setter';

interface ErrorPageProps {
  context?: string;
  error?: string;
}

const ErrorPage = ({ context, error }: ErrorPageProps) => {
  const contextMessage: string = context ? ` ${context}` : '';
  const errorMessage: string = error ? `\n(${error})` : '';
  const displayString: string = `There was an error${contextMessage}!${errorMessage}`;

  setTitle('Error!');
  return (
    <div className="flex justify-center w-full font-medium text-xl  whitespace-pre-line">
      {displayString}
    </div>
  );
};
export default ErrorPage;
