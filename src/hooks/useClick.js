import { useEffect } from "react";

export function useClickInside(ref, callback) {
  useEffect(() => {
    function handleClick(event) {
      if (ref.current && ref.current.contains(event.target)) {
        console.log("Clicked inside");
        callback(event);
      }
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, callback]);
}

export function useClickOutside(ref, callback) {
  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        console.log("Clicked outside");
        callback(event);
      }
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, callback]);
}
