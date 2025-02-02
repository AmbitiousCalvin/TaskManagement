import React, { useState, useEffect, useMemo, memo } from "react";
import { useLocalStorage } from "../hooks/useStorage";
import useToggle from "../hooks/useToggle";
import ModalForm from "./ModalForm";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ImportExportOutlinedIcon from "@mui/icons-material/ImportExportOutlined";
import "../styles/tasks.scss";
import { useClickOutside } from "../hooks/useClick";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CheckIcon from "@mui/icons-material/Check";
import { Tooltip, DropdownItem, DropdownList } from "./utils";
import Masonry from "@mui/lab/Masonry";
import { createTheme, ThemeProvider } from "@mui/material";

export function TaskPage() {
  const [tasks, setTasks] = useLocalStorage("items", []);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    content: "",
    priority: "high",
  });
  const [open, toggleOpen] = useToggle(false);

  const handleTaskUpdate = (newTask) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => (task.id === newTask.id ? newTask : task));
    });
  };

  const handleTaskDelete = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleAddTask = (taskId) => {
    setTasks((prevTasks) => {
      if (taskId) {
        return prevTasks.map((task) =>
          task.id === taskId ? { ...task, ...newTask } : task
        );
      }

      return [
        ...prevTasks,
        {
          ...newTask,
          type: "read",
          id: crypto.randomUUID(),
          status: false,
        },
      ];
    });
    setNewTask({
      title: "",
      content: "",
      priority: "high",
    });
  };

  const handleCloseModal = () => {
    toggleOpen(false);
    setNewTask({
      title: "",
      content: "",
      priority: "high",
    });
  };

  const normalizedSearchQuery = searchQuery.toLowerCase();
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchedCategory = category === "All" || task.status === category;
      const matchedQuery =
        searchQuery === "" ||
        task.title.toLowerCase().includes(normalizedSearchQuery);
      return matchedCategory && matchedQuery;
    });
  }, [tasks, category, searchQuery]);

  const finishedTasksCount = tasks.filter(
    (task) => task.status === true
  ).length;

  // Progress Bar Value
  const progressBarValue = Math.floor(
    (finishedTasksCount / tasks.length) * 100
  );

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 750,
        lg: 1100,
        xl: 1536,
      },
    },
  });

  let contentNotFound = "";
  if (tasks.length === 0) {
    if (category === "All") {
      contentNotFound = "You haven't added any tasks yet.";
    } else if (category === true) {
      contentNotFound = "You haven't finished any tasks yet.";
    } else {
      contentNotFound = "You have finished all your tasks.";
    }

    if (searchQuery.trim()) {
      contentNotFound = "Task not found...";
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {open && (
        <ModalForm
          open={open}
          onClose={handleCloseModal}
          handleAddTask={handleAddTask}
          setNewTask={setNewTask}
          newTask={newTask}
        />
      )}

      <TaskHeader
        category={category}
        searchQuery={searchQuery}
        setCategory={setCategory}
        setSearchQuery={setSearchQuery}
        toggleOpen={(val) => toggleOpen(val)}
      />

      <div className="progress-text-container">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {tasks.length > 0 && (
            <>
              <span className="progress-text__percent">
                {Math.floor((finishedTasksCount / tasks.length) * 100)}% DONE
              </span>
              <span className="progress-text__default">
                {finishedTasksCount} out of {tasks.length} Done
              </span>
            </>
          )}
        </div>
        <div
          className="custom-progress-bar-container"
          style={{
            "--progress-value": `${progressBarValue}%`,
          }}
        >
          <div
            className={`custom-progress__value ${
              progressBarValue === 100 && "full"
            }`}
          ></div>
          <span className="percent">
            {Math.floor((finishedTasksCount / tasks.length) * 100)}% Done
          </span>
        </div>
      </div>

      <Masonry
        sequential
        columns={{
          xs: 1,
          sm: 2,
          lg: 3,
        }}
        spacing={2}
        className="masonry-container"
      >
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            toggleOpen={toggleOpen}
            handleTaskUpdate={handleTaskUpdate}
            handleTaskDelete={handleTaskDelete}
            setNewTask={setNewTask}
          />
        ))}
        {contentNotFound.trim() && (
          <div className="content-not-found-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
              <g data-name="39-Book">
                <path d="M24 16a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm-6 8a6 6 0 0 1 9.47-4.89l-8.36 8.36A6 6 0 0 1 18 24zm6 6a6 6 0 0 1-3.47-1.11l8.36-8.36A6 6 0 0 1 24 30z" />
                <path d="M2 27V9a5 5 0 0 0 3 1h21v4h2V9a1 1 0 0 0-.29-.71A5.87 5.87 0 0 1 26 5a5.87 5.87 0 0 1 1.71-3.29A1 1 0 0 0 27 0H5a5 5 0 0 0-5 5v22a5 5 0 0 0 5 5h11v-2H5a3 3 0 0 1-3-3zM5 2h20a6.85 6.85 0 0 0-.84 2H9v2h15.13A6.85 6.85 0 0 0 25 8H5a3 3 0 0 1 0-6z" />
                <path d="M5 4h2v2H5zM20 15v-2H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h9v-2H7v-2zM5 22h2v2H5zM9 22h2v2H9z" />
              </g>
            </svg>
            <h1>{contentNotFound}</h1>
          </div>
        )}
      </Masonry>
    </ThemeProvider>
  );
}

// ==================================

const TaskItem = ({
  task,
  handleTaskUpdate,
  handleTaskDelete,
  toggleOpen,
  setNewTask,
}) => {
  const handleTaskCheck = () => {
    handleTaskUpdate({ ...task, status: !task.status });
  };

  const handleTaskPriority = (value) => {
    handleTaskUpdate({ ...task, priority: value });
  };

  const handleTaskEdit = async (taskId, type = "edit") => {
    await setNewTask({ ...task });
    toggleOpen(true);
  };

  const title = task.status ? "Completed" : "In Progress";

  const className = task.status ? "finished" : "pending";

  return (
    <li className="task-item">
      <section className="task-item__header">
        <div className="default-title__container">
          <div className="__btns-container">
            <button
              className={`priority-btn btn__small dropdown-btn default__tooltip-container ${task.priority}-btn`}
            >
              <FiberManualRecordIcon />
              {task.priority.toUpperCase()}
              <DropdownList>
                <DropdownItem onClick={() => handleTaskPriority("high")}>
                  High
                </DropdownItem>
                <DropdownItem onClick={() => handleTaskPriority("medium")}>
                  Medium
                </DropdownItem>
                <DropdownItem onClick={() => handleTaskPriority("low")}>
                  Low
                </DropdownItem>
              </DropdownList>
            </button>

            <button
              onClick={handleTaskCheck}
              className={`${className}-btn btn__small`}
            >
              <FiberManualRecordIcon />
              {title}
            </button>
          </div>

          <h1 className="task-title">
            {task.title.trim() !== "" ? (
              task.title
            ) : (
              <span className="light-text">Empty task...</span>
            )}
          </h1>
        </div>
        <p className="task-description">{task.content}</p>
      </section>

      <div className="__btns-container">
        <button
          className="icon-btn-small"
          onClick={() => handleTaskEdit(task.id)}
        >
          <EditOutlinedIcon />
        </button>
        <button
          className="icon-btn-small"
          onClick={() => handleTaskDelete(task.id)}
        >
          <DeleteOutlineOutlinedIcon />
        </button>
      </div>
    </li>
  );
};

// ==================================

const TaskHeader = ({
  category = "All",
  setCategory,
  searchQuery,
  setSearchQuery,
  toggleOpen,
}) => {
  const [showDropdown, toggleDropdown] = useToggle(false);
  const title =
    category === "All"
      ? "All"
      : category === true
      ? "Completed"
      : "In Progress";
  const className =
    category === "All" ? "all" : category === true ? "finished" : "pending";

  return (
    <header className="task-header">
      <section>
        <div className="__btns-container">
          <button
            className="btn btn-open-modal"
            onClick={() => toggleOpen(true)}
          >
            Add Task
          </button>
          <button
            onClick={toggleDropdown}
            className={`dropdown-btn default__tooltip-container ${className}-btn`}
          >
            <SortIcon />
            {title}
            <DropdownList>
              <DropdownItem onClick={() => setCategory("All")}>
                All
              </DropdownItem>
              <DropdownItem onClick={() => setCategory(false)}>
                In Progress
              </DropdownItem>
              <DropdownItem onClick={() => setCategory(true)}>
                Completed
              </DropdownItem>
            </DropdownList>
          </button>
        </div>
        <form className="search-bar-container">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search tasks..."
            className="search-bar"
          />
          <i className="fa fa-search icon-btn"></i>
        </form>
      </section>
    </header>
  );
};

// ==================================
