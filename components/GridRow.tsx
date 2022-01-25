import React, { useEffect, useState } from "react";

const WORD_LENGTH = 5;

type Props = {
  onChange: (word: string) => void;
};

export default function GridRow({ onChange, ...others }: Props) {
  const [letters, setLetters] = useState<string[]>([]);

  const handleChange = (event: any) => {
    const value = event.target.value;

    if (value?.length > 0) {
      setLetters([...letters, value]);
      console.log("focus to next");
    } else {
      const updatedLetters = [...letters];
      updatedLetters.pop();
      setLetters(updatedLetters);
    }
  };
  useEffect(() => {
    onChange(letters.join(""));
  }, [letters]);

  return (
    <div className="flex" {...others}>
      {Array.from(Array(WORD_LENGTH)).map((_, letterIdx) => (
        <input
          className="inline border border-solid text-center border-pink-500 bg-inherit p-2 m-1 w-12 uppercase font-semibold text-2xl"
          onChange={handleChange}
          maxLength={1}
          key={`letter-${letterIdx}`}
        />
      ))}
    </div>
  );
}
