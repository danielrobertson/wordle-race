import classNames from "classnames";
import cloneDeep from "lodash/cloneDeep";
import Head from "next/head";
import { useEffect, useState } from "react";
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
  const [submittedGuesses, setSubmittedGuesses] = useState<string[]>([]);
  const [currentCursorPosition, setCurrentCursorPosition] = useState<number>(0);
  const [currentGuessPosition, setCurrentGuessPosition] = useState<number>(0);
  const [hasWon, setHasWon] = useState(false);
  const [noContainsLetters, setNoContainsLetters] = useState<string[]>([]);
  const [containsLetters, setContainsLetters] = useState<string[]>([]);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);

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
      setSubmittedGuesses([...submittedGuesses, word]);
      if (word === targetWord) {
        setHasWon(true);
      } else {
        setCurrentGuessPosition((current) => 1 + current);
        setCurrentCursorPosition(0);
      }
    } else {
      console.log("no op - not enough letters");
    }
  };

  useEffect(() => {
    console.log("submitted guesses ", submittedGuesses);
    for (let guess of submittedGuesses) {
      for (let i = 0; i < guess.length; i++) {
        if (targetWord.includes(guess[i])) {
          if (targetWord.indexOf(guess[i]) === i) {
            setCorrectLetters((prev) => [...prev, guess[i]]);
          } else {
            setContainsLetters((prev) => [...prev, guess[i]]);
          }
        } else {
          setNoContainsLetters((prev) => [...prev, guess[i]]);
        }
      }
    }
  }, [submittedGuesses, targetWord]);

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
            {guessRow.map((guessLetter, letterIdx) => {
              const tileClasses = classNames(
                "flex justify-center items-center border-2 border-solid text-center border-slate-600 bg-inherit m-0.5 w-16 h-16 uppercase font-semibold text-3xl",
                {
                  "bg-yellow-600 border-yellow-600":
                    containsLetters.includes(guessLetter),
                },
                {
                  "bg-zinc-800 border-zinc-800":
                    noContainsLetters.includes(guessLetter),
                },
                {
                  "bg-green-600 border-green-600":
                    correctLetters.includes(guessLetter),
                }
              );

              return (
                <div className={tileClasses} key={`letter-${letterIdx}`}>
                  {guessLetter}
                </div>
              );
            })}
          </div>
        ))}

        <Keyboard
          onKey={handleKeyboardPress}
          noContainsLetters={noContainsLetters}
          containsLetters={containsLetters}
          correctLetters={correctLetters}
        />
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
