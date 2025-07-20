import { OptClassNameProps } from '../../../../types/common-props-types';

const FilmIcon = (props: OptClassNameProps) => (
  <span {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      width={18}
      height={18}
    >
      <g>
        <g>
          <path
            d="M486.4,51.2H25.6C11.46,51.2,0,62.66,0,76.8v358.4c0,14.14,11.46,25.6,25.6,25.6h460.8c14.14,0,25.6-11.46,25.6-25.6V76.8
          C512,62.66,500.54,51.2,486.4,51.2z M102.4,435.2H25.6V384h76.8V435.2z M102.4,358.4H25.6v-51.2h76.8V358.4z M102.4,281.6H25.6
          v-51.2h76.8V281.6z M102.4,204.8H25.6v-51.2h76.8V204.8z M102.4,128H25.6V76.8h76.8V128z M384,435.2H128V268.8h256V435.2z
           M384,243.2H128V76.8h256V243.2z M486.4,435.2h-76.8V384h76.8V435.2z M486.4,358.4h-76.8v-51.2h76.8V358.4z M486.4,281.6h-76.8
          v-51.2h76.8V281.6z M486.4,204.8h-76.8v-51.2h76.8V204.8z M486.4,128h-76.8V76.8h76.8V128z"
          />
        </g>
      </g>
    </svg>
  </span>
);
export default FilmIcon;
