import { JSX } from "react";
import { CreditResponse } from "../../../shared/types/models";
import PeopleEntry from "./PersonEntry";
import { AuthorType } from "../../../shared/types/roles";

interface EntryProps {
  title: string;
  content?: string;
  peopleContent?: CreditResponse[];
  peopleFilter?: AuthorType;
}

const EntrySection = (props: EntryProps): JSX.Element | null => {
  if (!props.title || (!props.content && !props.peopleContent)) {
    return null;
  }
  const filteredPeople: CreditResponse[] | null = !props.peopleContent
    ? null
    : !props.peopleFilter
      ? props.peopleContent
      : props.peopleContent.filter(
          (p: CreditResponse) => p?.role && p.role === props.peopleFilter
        );

  return (
    <div className="mt-4 space-y-2">
      <h2 className="block text-lg font-medium">{props.title}</h2>
      {props.content && (
        <p className="text-gray-700 text-sm leading-relaxed text-justify">
          {props.content}
        </p>
      )}
      {filteredPeople && <PeopleEntry people={filteredPeople} />}
    </div>
  );
};
export default EntrySection;
