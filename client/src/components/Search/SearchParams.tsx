import { styles } from '../../constants/tailwind-styles';
import { OptClassNameProps } from '../../types/common-props-types';
import { capitalize } from '../../utils/common-format-helper';
import ParamManager, { ParamStructure } from '../../utils/search-param-manager';
import { AnimatedDiv } from '../Common/Custom/AnimatedDiv';
import Button from '../Common/Custom/Button';

interface SearchParamsProps extends OptClassNameProps {
  toggleParam: (param: ParamStructure) => void;
  typeFilters: ParamManager;
}

const SearchParams = ({ toggleParam, typeFilters, ref }: SearchParamsProps) => {
  return (
    <div className="flex flex-row items-center gap-1" ref={ref}>
      <span className="text-gray-400 pr-2">{'Include:'}</span>
      {typeFilters.params.map((param: ParamStructure) => (
        <AnimatedDiv key={param.name} animKey={`search-param-${param.name}`}>
          <Button
            onClick={() => toggleParam(param)}
            className={`h-8 flex flex-row gap-1 ${styles.animations.zoomLessOnHover} ${!param.applied ? styles.buttons.dark : ''}`}
          >
            <span className="">{`${!param.applied ? '☐' : '☑'}`}</span>
            {capitalize(param.name)}
          </Button>
        </AnimatedDiv>
      ))}
    </div>
  );
};

export default SearchParams;
