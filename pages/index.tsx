import { useState } from "react";
import Head from "next/head";
import Confetti from "react-confetti";
import useWindowDimensions from "../hooks/useWindowDimensions";
import GridRow from "../components/GridRow";

const ATTEMPTS = 6;

export default function Home() {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [hasWon, setHasWon] = useState(false);
  const { width, height } = useWindowDimensions();

  // TODO generate and persist to server for room
  const targetWord = "FUBAR";

  const handleGuess = () => {
    const guess = currentGuess?.toLowerCase();
    if (guess === targetWord.toLowerCase()) {
      setHasWon(true);
      // TODO submit win to server
    } else {
      console.log("incorrect");
      // TODO update grid with validation results
    }
    setGuesses([...guesses, guess]);
  };

  const onChange = (word: string) => {
    console.log("🚀 ~ file: index.tsx ~ line 32 ~ onChange ~ word", word);
    setCurrentGuess(word);
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
        {hasWon && (
          <>
            <Confetti width={width} height={height} recycle={false} />
            <div className="absolute text-3xl -mt-12">You won! 🏆</div>
          </>
        )}
        {Array.from(Array(ATTEMPTS)).map((_, guessIdx) => (
          <GridRow key={`guess-${guessIdx}`} onChange={onChange} />
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
