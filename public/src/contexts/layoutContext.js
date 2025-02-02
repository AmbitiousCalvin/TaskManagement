import useToggle from "../hooks/useToggle";
import { useLocalStorage } from "../hooks/useStorage";
import {
  useCallback,
  useState,
  useEffect,
  createContext,
  useContext,
  useTransition,
} from "react";
import { useWindowSize } from "../hooks/useWindowSize";

const layoutContext = createContext(null);

export function useLayoutContext() {
  const context = useContext(layoutContext);

  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider.");
  }

  return context;
}

export function LayoutContextProvider(props) {
  const [isMiniMode, setIsMiniMode] = useLocalStorage(
    "desktop_sidebar_mini",
    "true"
  );

  const [isMobileMiniMode, toggleMobileMiniMode] = useToggle(false);
  const [isMobile, setIsMobile] = useState(false);
  const size = useWindowSize();

  const toggleMiniMode = useCallback(
    (value) => {
      console.log("toggle");
      if (!isMobile) {
        setIsMiniMode((prevState) => {
          return typeof value === "boolean" ? value : !prevState;
        });
      }
    },
    [setIsMiniMode, isMobile]
  );

  useEffect(() => {
    if (size.width <= 710 && !isMobile) {
      console.log(isMobile, "isMobile < 710");
      setIsMobile(true);
    }
    if (size.width > 710 && isMobile) {
      console.log(isMobile, "isMobile >710");
      setIsMobile(false);
    }
  }, [size.width]);

  return (
    <layoutContext.Provider
      value={{
        isMiniMode,
        toggleMiniMode,
        isMobileMiniMode,
        toggleMobileMiniMode,
        isMobile,
      }}
    >
      {props.children}
    </layoutContext.Provider>
  );
}
