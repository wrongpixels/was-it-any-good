//an extension of svg to wrap the icons inside an optional Link

import { JSX } from 'react';
import { Link } from 'react-router-dom';

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  url?: string;
}

const SVG = ({ url, ...rest }: SVGProps): JSX.Element => {
  const svgContent = (): JSX.Element => <svg {...rest} />;

  return (
    <>
      {(!!url && (
        <Link to={url} className="no-underline text-inherit cursor-pointer">
          {svgContent()}
        </Link>
      )) ||
        svgContent()}
    </>
  );
};
export default SVG;
