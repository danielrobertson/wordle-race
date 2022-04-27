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

type BoardReducerAction = {
  type: BoardActionTypes;
  value: { guessIdx: number; letter?: string };
};

const boardReducer = (state: string[][], action: BoardReducerAction) => {
  switch (action.type) {
    case BoardActionTypes.Add: {
      if (state[action.value.guessIdx].length < WORD_LENGTH) {
        let boardCopy = cloneDeep(state);
        if (action.value.letter) {
          boardCopy[action.value.guessIdx].push(action.value.letter);
        }
        return boardCopy;
      } else {
        return state;
      }
    }
    case BoardActionTypes.Remove: {
      let boardCopy = cloneDeep(state);
      boardCopy[action.value.guessIdx].pop();
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

  const [guessIdx, setGuessIdx] = useState(0);

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
            value: { guessIdx, letter },
          });
        },
        removeLetter: () => {
          dispatch({
            type: BoardActionTypes.Remove,
            value: { guessIdx },
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
