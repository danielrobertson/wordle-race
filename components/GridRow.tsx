import React, { useEffect, useState } from "react";

const WORD_LENGTH = 5;

type Props = {
  onChange: (word: string) => void;
};

export default function GridRow({ onChange, ...others }: Props) {
  const [letters, setLetters] = useState<string[]>(Array(WORD_LENGTH).fill(""));

  const handleChange = (event: any, letterIdx: number) => {
    const value = event.target.value;
    let updatedLetters = [...letters];
    updatedLetters[letterIdx] = value?.length > 0 ? value : "";
    setLetters(updatedLetters);
  };

  useEffect(() => onChange(letters.join("")), [letters]);

  return (
    <div className="flex" {...others}>
      {letters.map((_, letterIdx) => (
        <input
          className="inline border border-solid text-center border-pink-500 bg-inherit p-2 m-1 w-12 uppercase font-semibold text-2xl"
          onChange={(event) => handleChange(event, letterIdx)}
          maxLength={1}
          key={`letter-${letterIdx}`}
        />
      ))}
    </div>
  );
}
