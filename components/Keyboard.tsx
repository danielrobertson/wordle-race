import React, { MouseEventHandler } from "react";
import { SpecialKeys } from "./constants";
import { deleteKeySvg } from "./DeleteKey";

type Props = {
  onKey: (key: string) => void;
};

export default function Keyboard({ onKey }: Props) {
  const keyRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    [SpecialKeys.ENTER, "z", "x", "c", "v", "b", "n", "m", deleteKeySvg],
  ];

  const handleClick = (event: any) => onKey(event.target.textContent);

  return (
    <div className="mt-8">
      {keyRows.map((row, rowIdx) => (
        <div className="flex justify-center mt-1" key={`row-${rowIdx}`}>
          {row.map((key, idx) => (
            <button
              className="letter bg-gray-600 px-2 py-2 mx-0.5 rounded-sm uppercase active:bg-gray-700"
              onClick={handleClick}
              key={`key-${idx}`}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <style jsx>{`
        .letter {
          min-width: 31px;
        }
      `}</style>
    </div>
  );
}
