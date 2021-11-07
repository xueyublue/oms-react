import { useRef } from "react";

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = (options) => {
    htmlElRef.current && htmlElRef.current.focus(options);
  };

  return [htmlElRef, setFocus];
};

export default useFocus;
