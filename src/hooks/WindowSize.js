import { useLayoutEffect, useState } from "react";

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    const updateSize = () => {
      if (typeof window !== "undefined") {
        setSize([window.innerWidth, window.innerHeight]);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateSize);
    }

    updateSize();

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateSize);
      }
    };
  }, []);

  return size;
};

export default useWindowSize;
