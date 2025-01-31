import React from "react";
import "../styles/sidebar.scss";
import { useEffect, memo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useStorage";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TaskIcon from "@mui/icons-material/Task";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useLayoutContext } from "../contexts/layoutContext";

const NAVIGATION = [
  {
    header: "Main",
    items: [
      {
        title: "Tasks",
        icon: <TaskIcon fontSize="large" />,
        path: "/tasks",
        tooltip: "Manage your tasks", // Added tooltip
      },
      {
        title: "View Budgets",
        icon: <AccountBalanceIcon fontSize="large" />,
        path: "/budgets",
        tooltip: "Check and manage your budgets", // Added tooltip
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
      },
      {
        title: "Cooking",
        icon: <RestaurantMenuIcon fontSize="large" />,
        path: "/cooking",
        tooltip: "Find and save cooking recipes", // Added tooltip
      },
      {
        title: "GitHub Activity",
        icon: <GitHubIcon fontSize="large" />,
        path: "/github-activity",
        tooltip: "View your GitHub activity", // Added tooltip
      },
    ],
  },
];

// ===========================

const Section = memo(
  ({ header, items, handleClick, activeIndex, sectionIndex }) => {
    return (
      <div className="sidebar-section">
        <div className="section-header">{header}</div>
        <ul className="section-items">
          {items?.map((item, itemIndex) => {
            const uniqueIndex = `${sectionIndex}-${itemIndex}`; // Generate unique index
            return (
              <Link
                to={item.path}
                key={uniqueIndex}
                title={item.tooltip}
                className={`section-item ${
                  activeIndex === uniqueIndex ? "active" : ""
                }`}
                onClick={() => handleClick(uniqueIndex)}
              >
                <div className="section-item__icon">{item.icon}</div>
                <div className="section-item__title">{item.title}</div>
              </Link>
            );
          })}
        </ul>
      </div>
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
      <div className={classes.join(" ")}>
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

        <div className="sidebar-footer">
          <p>
            &copy; {new Date().getFullYear()} CalvinTaw. All rights reserved.
          </p>
        </div>
      </div>
      <div
        onClick={() => handleClickInside()}
        className="sidebar-overlay"
      ></div>
    </>
  );
};

const memoizedSidebar = memo(Sidebar);

export { memoizedSidebar as Sidebar };
