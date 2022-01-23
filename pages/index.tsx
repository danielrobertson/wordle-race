import Head from "next/head";
import { useState } from "react";

const WORD_LENGTH = 5;
const ATTEMPTS = 6;

type Guess = {
  word: string[];
};

export default function Home() {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentLetter, setCurrentLetter] = useState<string>();

  const handleChange = (guessIdx: number, letterIdx: number) =>
    console.log(`TODO track ${currentLetter} at ${guessIdx} ${letterIdx}`);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-slate-900 text-stone-200">
      <Head>
        <title>Wordle Race</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="text-4xl font-bold tracking-wide uppercase">
        Wordle Race
      </div>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        {Array.from(Array(ATTEMPTS)).map((_, guessIdx) => (
          <div className="flex">
            {Array.from(Array(WORD_LENGTH)).map((_, letterIdx) => (
              <input
                className="inline border border-solid text-center border-pink-500 bg-inherit p-2 m-1 w-12 uppercase font-semibold text-2xl"
                value={currentLetter}
                onChange={() => handleChange(guessIdx, letterIdx)}
                maxLength={1}
              />
            ))}
          </div>
        ))}
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
