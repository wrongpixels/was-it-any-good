import { OptStringProps } from '../../../types/common-props-types';
import SpinnerPage from './SpinnerPage';

const CreatingMediaPage = ({ text }: OptStringProps) => (
  <SpinnerPage text={`Creating${text ? ` ${text}` : ''}…`} />
);
export default CreatingMediaPage;
