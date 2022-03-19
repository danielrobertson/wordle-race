import { createContext, useContext, useReducer } from "react";
import { ATTEMPTS, WORD_LENGTH } from "../components/constants";

interface GameContextType {
  board: string[][];
}

export const GameContext = createContext<GameContextType>({
  board: [],
});
GameContext.displayName = "GameContext";

type GameProviderProps = {
  children: JSX.Element | JSX.Element[];
};

const boardReducer = (state: string[][], action) => {
  return state;
};

export const GameProvider = ({ children }: GameProviderProps) => {
  const [board, dispatch] = useReducer(boardReducer, [["a", "b"]]);

  return (
    <GameContext.Provider value={{ board }}>{children}</GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
