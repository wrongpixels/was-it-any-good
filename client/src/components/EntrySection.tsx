import { JSX } from "react";
import { CreditResponse, MergedCredits } from "../../../shared/types/models";
import PeopleEntry from "./PersonEntry";
import { AuthorType } from "../../../shared/types/roles";

interface EntryProps {
  title: string;
  content?: string;
  crewContent?: MergedCredits[];
  castContent?: CreditResponse[];
  peopleFilter?: AuthorType[];
}

const EntrySection = (props: EntryProps): JSX.Element | null => {
  if (
    !props.title ||
    (!props.content && !props.crewContent && !props.castContent)
  ) {
    return null;
  }
  const filteredPeople: MergedCredits[] | CreditResponse[] | null =
    props.castContent
      ? props.castContent
      : !props.crewContent
        ? null
        : !props.peopleFilter || props.peopleFilter.length === 0
          ? props.crewContent
          : props.crewContent.filter(
              (p: MergedCredits) =>
                p?.mergedRoles &&
                p.mergedRoles.some((role: string) =>
                  props.peopleFilter!.includes(role as AuthorType)
                )
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
