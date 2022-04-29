import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";

export const useTile = (guessIdx: number, letterIdx: number) => {
  const { board } = useContext(GameContext);
  const row = board[guessIdx] || [];
  const { value, guessedContains, guessedCorrect, guessedWrong } =
    row[letterIdx] || {};

  return { value, guessedContains, guessedCorrect, guessedWrong };
};
