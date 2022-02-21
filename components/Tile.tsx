import classNames from "classnames";
import React from "react";

type Props = {
  guessIdx: number;
  letterIdx: number;
};

export default function Tile({ guessIdx, letterIdx }: Props) {
  const tileClasses = classNames(
    "flex justify-center items-center border-2 border-solid text-center border-slate-600 bg-inherit m-0.5 w-16 h-16 uppercase font-semibold text-3xl"
  );

  return <div className={tileClasses}>{letterIdx}</div>;
}
