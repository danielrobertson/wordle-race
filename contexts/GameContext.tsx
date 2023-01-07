import cloneDeep from "lodash/cloneDeep";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { pathToFileURL } from "url";
import { ATTEMPTS, WORD_LENGTH } from "../constants";

type Tile = {
  value: string;
  isCorrect: boolean;
  isInWord: boolean;
  isLocked: boolean;
};

interface GameContextType {
  board: Tile[][];
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
  "Update",
}

// TODO split this up and type narrow via type guards for cleaner code
type BoardReducerAction = {
  type: BoardActionTypes;
  value: {
    guessIdx: number;
    tileIdx?: number;
    letter?: string;
    isCorrect?: boolean;
    isInWord?: boolean;
    isLocked?: boolean;
  };
};

const boardReducer = (state: Tile[][], action: BoardReducerAction) => {
  switch (action.type) {
    case BoardActionTypes.Add: {
      if (state[action.value.guessIdx].length < WORD_LENGTH) {
        let boardCopy = cloneDeep(state);
        if (action.value.letter) {
          const newTile = {
            value: action.value.letter,
            isCorrect: false,
            isInWord: true,
            isLocked: false,
          } as Tile;

          boardCopy[action.value.guessIdx].push(newTile);
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
    case BoardActionTypes.Update: {
      const { guessIdx, tileIdx, isCorrect, isInWord, isLocked } = action.value;
      if (tileIdx !== undefined) {
        let boardCopy = cloneDeep(state);
        boardCopy[guessIdx][tileIdx].isCorrect = Boolean(isCorrect);
        boardCopy[guessIdx][tileIdx].isInWord = Boolean(isInWord);
        boardCopy[guessIdx][tileIdx].isLocked = Boolean(isLocked);
        return boardCopy;
      } else {
        return state;
      }
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

  // TODO generate and persist to server for room
  const [targetWord, setTargetWord] = useState<string>();
  const [guessIdx, setGuessIdx] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    const fetchTargetWord = async () => {
      // TODO migrate this to a server, consider replacing with www.wordsapi.com
      const response = await fetch(
        `https://random-word-api.herokuapp.com/word?length=${WORD_LENGTH}`
      );
      const data = await response.json();
      setTargetWord(data[0]);
    };

    if (!targetWord) {
      fetchTargetWord();
    }
  });

  const validateGuess = () => {
    const guess = board[guessIdx].map((tile) => tile.value).join("");
    if (guess.length === WORD_LENGTH) {
      // TODO color tiles with hints, lock tiles, update guessIdx
      for (let tileIdx = 0; tileIdx < WORD_LENGTH; tileIdx++) {
        if (targetWord && guess[tileIdx] === targetWord[tileIdx]) {
          dispatch({
            type: BoardActionTypes.Update,
            value: { guessIdx, tileIdx, isCorrect: true, isLocked: true },
          });
        } else if (targetWord && targetWord.includes(guess[tileIdx])) {
          dispatch({
            type: BoardActionTypes.Update,
            value: { guessIdx, tileIdx, isInWord: true, isLocked: true },
          });
        } else {
          dispatch({
            type: BoardActionTypes.Update,
            value: { guessIdx, tileIdx, isLocked: true },
          });
        }
      }

      if (guess === targetWord) {
        setHasWon(true);
      }
    } else {
      alert("Please fill in all tiles");
    }
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
