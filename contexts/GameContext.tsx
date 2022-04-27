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
  guessedWrong: boolean;
  guessedContains: boolean;
  guessedCorrect: boolean;
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
}

type BoardReducerAction = {
  type: BoardActionTypes;
  value: { guessIdx: number; letter?: string };
};

const boardReducer = (state: Tile[][], action: BoardReducerAction) => {
  switch (action.type) {
    case BoardActionTypes.Add: {
      if (state[action.value.guessIdx].length < WORD_LENGTH) {
        let boardCopy = cloneDeep(state);
        if (action.value.letter) {
          const newTile = {
            value: action.value.letter,
            guessedWrong: false,
            guessedContains: false,
            guessedCorrect: false,
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
  const [targetWord, setTargetWord] = useState();
  const [guessIdx, setGuessIdx] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    const fetchTargetWord = async () => {
      // TODO migrate this to a server
      // TODO consider replacing with www.wordsapi.com
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
      // TODO color tiles with hints
      // TODO indicate if word is in word list or not
      if (guess === targetWord) {
        setHasWon(true);
      }
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
