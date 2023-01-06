import React, { useEffect } from "react";
import classNames from "classnames";
import { useGame } from "../contexts/GameContext";
import { SpecialKeys } from "../constants";
import { deleteKeySvg } from "./DeleteKey";

export default function Keyboard() {
  const { addLetter, removeLetter, validateGuess } = useGame();

  const keyRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    [SpecialKeys.ENTER, "z", "x", "c", "v", "b", "n", "m", deleteKeySvg],
  ];

  const handleClick = (event: any) => {
    const key = event.target.textContent;
    if (key === SpecialKeys.ENTER) {
      // validate guess
      validateGuess();
    } else if (key === "") {
      // backspace key
      removeLetter();
    } else {
      addLetter(key);
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    // TODO implement desktop keyboard support
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  // TODO populate keyboard with hints
  const noContainsLetters = [""];
  const containsLetters = [""];
  const correctLetters = [""];

  return (
    <div className="mt-2 md:mt-8 mb-8 px-1 w-full md:max-w-min">
      {keyRows.map((row, rowIdx) => {
        const classes = classNames(
          { "mx-3": rowIdx === 1 }, // indent second keyboard row like real life keyboards
          "flex justify-center mt-1"
        );

        return (
          <div className={classes} key={`row-${rowIdx}`}>
            {row.map((key, idx) => {
              const buttonClasses = classNames(
                "grow letter bg-gray-600 px-2 py-4 mx-0.5 rounded-sm uppercase active:bg-gray-700",
                {
                  "bg-yellow-600":
                    typeof key === "string" && containsLetters.includes(key),
                },
                {
                  "bg-zinc-800":
                    typeof key === "string" && noContainsLetters.includes(key),
                },
                {
                  "bg-green-600":
                    typeof key === "string" && correctLetters.includes(key),
                }
              );

              return (
                <button
                  className={buttonClasses}
                  onClick={handleClick}
                  key={`key-${idx}`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        );
      })}
      <style jsx>{`
        .letter {
          min-width: 31px;
        }

        @media (min-width: 768px) {
          .letter {
            min-width: 50px;
          }
        }
      `}</style>
    </div>
  );
}
