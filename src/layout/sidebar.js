import React from "react";
import "../styles/sidebar.scss";
import { useEffect, memo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useStorage";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useLayoutContext } from "../contexts/layoutContext";
import { Tooltip } from "../components/utils";

const NAVIGATION = [
  {
    header: "Main",
    items: [
      {
        title: "Tasks",
        icon: <ListAltOutlinedIcon fontSize="large" />,
        path: "/tasks",
        tooltip: "Manage your tasks", // Added tooltip
      },
      {
        title: "View Budgets",
        icon: <LocalAtmOutlinedIcon fontSize="large" />,
        path: "/budgets",
        tooltip: "Check and manage your budgets", // Added tooltip
        action: () => alert("This would take you to the 'View Budgets' Page"), // Added action
      },
    ],
  },
  {
    header: "Hobbies",
    items: [
      {
        title: "Music",
        icon: <MusicNoteIcon fontSize="large" />,
        path: "/music",
        tooltip: "Explore your music interests", // Added tooltip
        action: () => alert("This would take you to the 'Music' Page"), // Added action
      },
      {
        title: "Cooking",
        icon: <RestaurantMenuIcon fontSize="large" />,
        path: "/cooking",
        tooltip: "Find and save cooking recipes", // Added tooltip
        action: () => alert("This would take you to the 'Cooking' Page"), // Added action
      },
      {
        title: "GitHub Activity",
        icon: <GitHubIcon fontSize="large" />,
        path: "/github-activity",
        tooltip: "View your GitHub activity", // Added tooltip
        action: () =>
          alert("This would take you to the 'GitHub Activity' Page"), // Added action
      },
    ],
  },
];

// ===========================

const Section = memo(
  ({ header, items, handleClick, activeIndex, sectionIndex }) => {
    return (
      <section
        className="sidebar-section"
        aria-labelledby={`section-${sectionIndex}`}
      >
        <div
          id={`section-${sectionIndex}`}
          className="section-header"
          role="heading"
          aria-level="2"
        >
          {header}
        </div>
        <ul className="section-items" role="list">
          {items?.map((item, itemIndex) => {
            const uniqueIndex = `${sectionIndex}-${itemIndex}`; // Generate unique index
            return (
              <li
                onClick={item.action}
                tabindex="0"
                key={uniqueIndex}
                role="listitem"
                aria-selected={activeIndex === uniqueIndex ? "true" : "false"}
              >
                <div
                  // to={item.path}
                  title={item.tooltip}
                  className={`section-item default__tooltip-container ${
                    activeIndex === uniqueIndex ? "active" : ""
                  }`}
                  onClick={() => {
                    handleClick(uniqueIndex);
                  }}
                  role="link"
                  aria-label={item.tooltip} // Provides description on hover/focus
                >
                  <div
                    className="section-item__icon"
                    role="img"
                    aria-label={item.title}
                  >
                    {item.icon}
                  </div>
                  <div className="section-item__title">{item.title}</div>

                  <Tooltip>{item.tooltip}</Tooltip>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }
);

const Sidebar = () => {
  const { isMiniMode, isMobileMiniMode, toggleMobileMiniMode, isMobile } =
    useLayoutContext();
  const [activeIndex, setActiveIndex] = useLocalStorage("path", "0-0");
  const navigate = useNavigate();

  useEffect(() => {
    const [sectionIndex, itemIndex] = activeIndex.split("-");
    navigate(NAVIGATION[sectionIndex]?.items[itemIndex]?.path || "/");
  }, [activeIndex, navigate]);

  useEffect(() => {
    if (!isMobile && isMobileMiniMode) {
      toggleMobileMiniMode(false);
    }
  }, [isMobile, isMobileMiniMode]);

  const handleClickInside = useCallback(() => {
    if (isMobile) {
      toggleMobileMiniMode(false);
    }
  }, [isMobile, toggleMobileMiniMode]);

  const classes = ["sidebar"];
  if (isMiniMode) classes.push("mini");
  if (isMobileMiniMode) classes.push("mini_mobile");

  return (
    <>
      <nav
        className={classes.join(" ")}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        {NAVIGATION.map((section, sectionIndex) => (
          <Section
            key={sectionIndex}
            header={section.header}
            items={section.items}
            handleClick={(index) => setActiveIndex(`${index}`)}
            activeIndex={activeIndex}
            sectionIndex={sectionIndex}
          />
        ))}

        <footer className="sidebar-footer" role="contentinfo">
          <p>
            &copy; {new Date().getFullYear()} CalvinTaw. All rights reserved.
          </p>
        </footer>
      </nav>
      <div
        onClick={() => handleClickInside()}
        className="page-overlay"
        role="button"
        aria-label="Close sidebar overlay"
        tabIndex="0"
      ></div>
    </>
  );
};

const memoizedSidebar = memo(Sidebar);

export { memoizedSidebar as Sidebar };
