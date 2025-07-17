import { OptStringProps } from '../../../types/common-props-types';
import SpinnerPage from './SpinnerPage';

const LoadingPage = ({ text }: OptStringProps) => (
  <SpinnerPage text={`Loading${text ? ` ${text}` : ''}...`} />
);
export default LoadingPage;
