import Head from "next/head";
import { useEffect, useState } from "react";

const WORD_LENGTH = 5;
const ATTEMPTS = 6;

export default function Home() {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [hasWon, setHasWon] = useState(false);

  const targetWord = "FUBAR";

  const handleChange = (event: any, guessIdx: number, letterIdx: number) => {
    const updatedCurrentGuess = [...currentGuess];
    updatedCurrentGuess[letterIdx] = event.target.value;
    setCurrentGuess(updatedCurrentGuess);
  };

  const handleGuess = () => {
    const guess = currentGuess.join("").toLowerCase();
    if (guess === targetWord.toLowerCase()) {
      setHasWon(true);
      // TODO submit win to server
    } else {
      console.log("lose");
      // TODO update grid with validation results
    }
    setGuesses([...guesses, guess]);
  };

  return (
    <div className="flex flex-col p-0 m-0 items-center justify-center min-h-screen bg-slate-900 text-stone-200">
      <Head>
        <title>Wordle Race</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="py-2 mx-10 text-4xl font-bold tracking-wide uppercase text-center border-b border-stone-600">
        Wordle Race
      </div>

      <main className="flex flex-col items-center w-full flex-1 mx-10 m-20 text-center">
        {hasWon && <div className="absolute text-3xl -mt-12">You won! 🏆</div>}
        {Array.from(Array(ATTEMPTS)).map((_, guessIdx) => (
          <div className="flex" key={`guess-${guessIdx}`}>
            {Array.from(Array(WORD_LENGTH)).map((_, letterIdx) => (
              <input
                className="inline border border-solid text-center border-pink-500 bg-inherit p-2 m-1 w-12 uppercase font-semibold text-2xl"
                onChange={(event) => handleChange(event, guessIdx, letterIdx)}
                maxLength={1}
              />
            ))}
          </div>
        ))}

        <button
          className="bg-gray-600 px-2 mt-5 rounded-sm uppercase"
          onClick={handleGuess}
        >
          Enter
        </button>
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
