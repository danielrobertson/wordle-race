import cloneDeep from "lodash/cloneDeep";
import { createContext, useContext, useReducer, useState } from "react";
import { ATTEMPTS, WORD_LENGTH } from "../constants";

interface GameContextType {
  board: string[][];
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  hasWon: boolean;
  validateGuess: () => void;
}

export const GameContext = createContext<GameContextType>({
  board: [],
  addLetter: () => {},
  removeLetter: () => {},
  hasWon: false,
  validateGuess: () => {},
});

GameContext.displayName = "GameContext"; // used by react dev tools

type GameProviderProps = {
  children: JSX.Element | JSX.Element[];
};

enum BoardActionTypes {
  "Add",
  "Remove",
}

const boardReducer = (
  state: string[][],
  action: { type: BoardActionTypes; value?: string }
) => {
  switch (action.type) {
    case BoardActionTypes.Add: {
      let boardCopy = cloneDeep(state);
      // TODO put a type guard in here then remove this if-statement
      if (action.value) {
        // TODO remove hardcoded row 0
        boardCopy[0].push(action.value);
      }
      return boardCopy;
    }
    case BoardActionTypes.Remove: {
      let boardCopy = cloneDeep(state);
      // TODO remove hardcoded row 0
      boardCopy[0].pop();
      return boardCopy;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

export const GameProvider = ({ children }: GameProviderProps) => {
  const [board, dispatch] = useReducer(
    boardReducer,
    Array.from(Array(ATTEMPTS), () => [])
  );
  console.log(
    "🚀 ~ file: GameContext.tsx ~ line 58 ~ GameProvider ~ board",
    board
  );

  const [hasWon, setHasWon] = useState(false);

  const validateGuess = () => {
    // TODO validate guess
    setHasWon(true);
  };

  return (
    <GameContext.Provider
      value={{
        board,
        addLetter: (letter: string) => {
          dispatch({
            type: BoardActionTypes.Add,
            value: letter,
          });
        },
        removeLetter: () => {
          dispatch({
            type: BoardActionTypes.Remove,
          });
        },
        hasWon,
        validateGuess,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
