import { useState, useEffect } from "react";

function useWindowDimensions() {
  const isClient = typeof window === "object";

  function getSize() {
    return {
      height: isClient ? window.innerHeight : undefined,
      width: isClient ? window.innerWidth : undefined,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return undefined;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

export default useWindowDimensions;
