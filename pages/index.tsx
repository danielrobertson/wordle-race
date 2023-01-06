import cloneDeep from "lodash/cloneDeep";
import uniqueId from "lodash/uniqueId";
import Head from "next/head";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { ATTEMPTS, SpecialKeys, WORD_LENGTH } from "../constants";
import Keyboard from "../components/Keyboard";
import Row from "../components/Row";
import { useGame } from "../contexts/GameContext";
import useWindowDimensions from "../hooks/useWindowDimensions";

export default function Home() {
  // custom useGame hook maintains and drives most of the game state 👇
  const { hasWon } = useGame();
  const { width, height } = useWindowDimensions();

  useEffect(
    () =>
      alert(
        "🚧 this project is still in development, feel free to browse code in progress on GitHub"
      ),
    []
  );

  return (
    <div className="flex flex-col p-0 m-0 items-center justify-center min-h-screen bg-slate-900 text-stone-200">
      <Head>
        <title>Wordle Race 🏁</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="py-3 mx-auto text-4xl font-bold tracking-wide uppercase text-center border-b border-stone-600">
        Wordle Race 🏁
      </h1>

      <main className="flex flex-col items-center w-full flex-1 mx-14 mt-2 md:mt-8 text-center">
        {hasWon && <Confetti width={width} height={height} recycle={false} />}

        {[...Array(ATTEMPTS)].map((_, i) => (
          <Row guessIdx={i} key={uniqueId()} />
        ))}

        <Keyboard />
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
