import { useRef, memo } from "react";
import "../styles/header.scss";
import useDarkMode from "../hooks/useDarkMode";
import useToggle from "../hooks/useToggle";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { useLayoutContext } from "../contexts/layoutContext";

const MenuToggleButton = memo(function () {
  const {
    isMiniMode,
    toggleMiniMode,
    isMobileMiniMode,
    toggleMobileMiniMode,
    isMobile,
  } = useLayoutContext();

  const handleClick = () => {
    if (isMobile) {
      toggleMobileMiniMode();
    } else {
      toggleMiniMode();
    }
  };

  return (
    <button className="icon-btn menu-icon" onClick={handleClick}>
      {isMiniMode && !isMobile && <MenuIcon />}
      {isMobile && !isMobileMiniMode && <MenuIcon />}
      {!isMiniMode && !isMobile && <MenuOpenIcon />}
      {isMobileMiniMode && isMobile && <MenuOpenIcon />}
    </button>
  );
});

const HeaderSection = memo(function () {
  const [darkMode, setDarkMode] = useDarkMode();
  const [isOpen, toggleSearchBar] = useToggle(false);
  const inputRef = useRef(null);

  console.log("header section rendered");

  function handleClick() {
    toggleSearchBar();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  return (
    <>
      <div className="logo-container">
        <i className="fa-brands fa-sellsy"></i>
        <span className="brand-name">Dashboard</span>
      </div>

      <section>
        {isOpen && (
          <button className="icon-btn voice-search-icon">
            <i className="fa fa-microphone"></i>
          </button>
        )}

        <form
          className={`search-bar-container ${isOpen && "show"}`}
          onClick={() => inputRef.current?.focus()}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            className="search-bar"
          />
          <i className="fa fa-search icon-btn"></i>
        </form>

        {!isOpen && (
          <button className="icon-btn search-toggle-icon" onClick={handleClick}>
            <i className="fa fa-search"></i>
          </button>
        )}

        {isOpen && (
          <button className="icon-btn close-search-icon" onClick={handleClick}>
            <i className="fa fa-angle-left"></i>
          </button>
        )}

        <button
          className="icon-btn theme-icon"
          onClick={() => setDarkMode(!darkMode)}
        >
          {!darkMode && <i className="fa fa-moon"></i>}
          {darkMode && <i className="fa fa-sun"></i>}
        </button>
      </section>
    </>
  );
});

function Header() {
  console.log("header rendered");

  return (
    <header>
      <MenuToggleButton />
      <HeaderSection />
    </header>
  );
}

const memoizedHeader = memo(Header);
export { memoizedHeader as Header };
