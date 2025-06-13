import { JSX } from "react";
import { GenreResponse } from "../../../shared/types/models";
import React from "react";

interface GenreSectionProps {
  genres: GenreResponse[];
}

const GenreSection = ({ genres }: GenreSectionProps): JSX.Element | null => {
  if (!genres || genres.length < 1) {
    return null;
  }
  return (
    <div className="text-gray-400">
      {genres.map((g: GenreResponse, i: number) => (
        <React.Fragment key={g.id}>
          {i > 0 && " | "}
          <a className="text-sm">{g.name}</a>
        </React.Fragment>
      ))}
    </div>
  );
};

export default GenreSection;
