import React from "react";
import uniqueId from "lodash/uniqueId";
import { WORD_LENGTH } from "./constants";
import Tile from "./Tile";

type Props = {
  guessIdx: number;
};

export default function Row({ guessIdx, ...others }: Props) {
  return (
    <div className="flex" {...others}>
      {[...Array(WORD_LENGTH)].map((_, i) => (
        <Tile guessIdx={guessIdx} letterIdx={i} key={uniqueId()} />
      ))}
    </div>
  );
}
