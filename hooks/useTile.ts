import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";

export const useTile = (guessIdx: number, letterIdx: number) => {
  const { board } = useContext(GameContext);
  const row = board[guessIdx] || [];
  const { value, isCorrect, isInWord, isLocked } = row[letterIdx] || {};

  return { value, isCorrect, isInWord, isLocked };
};
