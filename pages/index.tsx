import cloneDeep from "lodash/cloneDeep";
import Head from "next/head";
import { useState } from "react";
import Confetti from "react-confetti";
import { ATTEMPTS, SpecialKeys, WORD_LENGTH } from "../components/constants";
import Keyboard from "../components/Keyboard";
import useWindowDimensions from "../hooks/useWindowDimensions";

export default function Home() {
  const [guesses, setGuesses] = useState<string[][]>(
    Array(ATTEMPTS)
      .fill(null)
      .map((_) => Array(WORD_LENGTH).fill(null))
  );
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [currentCursorPosition, setCurrentCursorPosition] = useState<number>(0);
  const [currentGuessPosition, setCurrentGuessPosition] = useState<number>(0);
  const [hasWon, setHasWon] = useState(false);
  const { width, height } = useWindowDimensions();

  // TODO generate and persist to server for room
  const targetWord = "fubar";

  const handleKeyboardPress = (key: string) => {
    if (key === SpecialKeys.ENTER) {
      const guess = guesses[currentGuessPosition];
      validateGuess(guess);
    } else if (key === "" && currentCursorPosition > 0) {
      setGuesses((currentGuesses) => {
        let updatedGuesses = cloneDeep(currentGuesses);
        updatedGuesses[currentGuessPosition][currentCursorPosition - 1] = "";
        return updatedGuesses;
      });
      setCurrentCursorPosition((current) => current - 1);
    } else {
      if (currentCursorPosition < WORD_LENGTH) {
        setGuesses((currentGuesses) => {
          let updatedGuesses = cloneDeep(currentGuesses);
          updatedGuesses[currentGuessPosition][currentCursorPosition] = key;
          return updatedGuesses;
        });

        setCurrentCursorPosition((current) => 1 + current);
      }
    }
  };

  const validateGuess = (guess: string[]) => {
    const word = guess.join("");
    if (word.length === WORD_LENGTH) {
      if (word === targetWord) {
        setHasWon(true);
      } else {
        setGuessedLetters(guessedLetters.concat(guess));
        setCurrentGuessPosition((current) => 1 + current);
        setCurrentCursorPosition(0);
      }
    } else {
      console.log("no op - not enough letters");
    }
  };

  return (
    <div className="flex flex-col p-0 m-0 items-center justify-center min-h-screen bg-slate-900 text-stone-200">
      <Head>
        <title>Wordle Race</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="py-3 mx-auto text-4xl font-bold tracking-wide uppercase text-center border-b border-stone-600">
        Wordle Race 🏎
      </div>

      <main className="flex flex-col items-center w-full flex-1 mx-14 mt-2 md:mt-8 text-center">
        {hasWon && <Confetti width={width} height={height} recycle={false} />}
        {guesses.map((guessRow, guessIdx) => (
          <div className="flex" key={`guess-${guessIdx}`}>
            {guessRow.map((guessLetter, letterIdx) => (
              <div
                className="flex justify-center items-center border-2 border-solid text-center border-slate-600 bg-inherit m-0.5 w-16 h-16 uppercase font-semibold text-3xl "
                key={`letter-${letterIdx}`}
              >
                {guessLetter}
              </div>
            ))}
          </div>
        ))}

        <Keyboard onKey={handleKeyboardPress} />
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://danielrobertson.me/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with <span className="pr-2 pl-1">❤️</span> by danielrobertson
        </a>
      </footer>
    </div>
  );
}
