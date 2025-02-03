import { useRef, memo } from "react";
import "../styles/header.scss";
import useDarkMode from "../hooks/useDarkMode";
import useToggle from "../hooks/useToggle";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { useLayoutContext } from "../contexts/layoutContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

function Header() {
  return (
    <header className="header">
      <MenuToggleButton />
      <HeaderSection />
    </header>
  );
}

const memoizedHeader = memo(Header);
export { memoizedHeader as Header };

// LogoContainer: You Can Customize Your Brand Name and BrandIcon

const LogoContainer = memo(function ({ brand, brandIcon }) {
  return (
    <div
      tabIndex="1"
      className="logo-container"
      role="img"
      aria-label={brand ?? "Dashboard"}
    >
      {!brandIcon && <i className="fa-brands fa-sellsy"></i>}
      {brandIcon}
      <span className="brand-name">{brand ?? "Dashboard"}</span>
    </div>
  );
});

// Menu Icon: You Can Customize Your Menu Icon Apperance

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
    <button
      className="icon-btn menu-icon"
      onClick={handleClick}
      aria-label={isMiniMode && !isMobile ? "Open Menu" : "Close Menu"}
    >
      {isMiniMode && !isMobile && <MenuIcon />}
      {isMobile && !isMobileMiniMode && <MenuIcon />}
      {!isMiniMode && !isMobile && <MenuOpenIcon />}
      {isMobileMiniMode && isMobile && <MenuOpenIcon />}
    </button>
  );
});

// ========================
const HeaderSection = memo(function () {
  const [darkMode, setDarkMode] = useDarkMode();
  const [isOpen, toggleSearchBar] = useToggle(false);
  const inputRef = useRef(null);

  function handleClick() {
    toggleSearchBar();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  return (
    <>
      <LogoContainer />

      <section role="region" aria-labelledby="header-section">
        <button
          className="btn"
          aria-label="Sign up"
          onClick={() => alert("Signing In... :)")}
        >
          Sign up
        </button>

        <button
          className="icon-btn theme-icon"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle Dark Mode"
        >
          {!darkMode && <DarkModeIcon />}
          {darkMode && <LightModeIcon />}
        </button>
      </section>
    </>
  );
});

{
  /* <form
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
        </form> */
}

{
  /* {!isOpen && (
          <button className="icon-btn search-toggle-icon" onClick={handleClick}>
            <i className="fa fa-search"></i>
          </button>
        )}

        {isOpen && (
          <button className="icon-btn close-search-icon" onClick={handleClick}>
            <i className="fa fa-angle-left"></i>
          </button>
        )} */
}
