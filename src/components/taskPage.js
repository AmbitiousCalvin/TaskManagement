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
import CheckIcon from "@mui/icons-material/Check";

export function TaskPage() {
  const [tasks, setTasks] = useLocalStorage("items", []);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTask, setNewTask] = useState({ title: "", content: "" });
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
          timeStamp: new Date().toUTCString(),
        },
      ];
    });
    setNewTask({ title: "", content: "" });
  };

  const handleCloseModal = () => {
    toggleOpen(false);
    setNewTask({ title: "", content: "" });
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

  return (
    <>
      {/* <h1>Task Page</h1> */}
      {open && (
        <ModalForm
          open={open}
          onClose={handleCloseModal}
          handleAddTask={handleAddTask}
          setNewTask={setNewTask}
          newTask={newTask}
        />
      )}
      {/* 
      <progress
        className="progress-bar"
        value={finishedTasksCount}
        min="0"
        max={tasks.length}
        step={0.01}
      ></progress>
      <h2>
        {finishedTasksCount} out of {tasks.length} Done
        <br />
        {Math.floor((finishedTasksCount / tasks.length) * 100)}% Done
      </h2> */}

      <TaskHeader
        category={category}
        searchQuery={searchQuery}
        setCategory={setCategory}
        setSearchQuery={setSearchQuery}
        toggleOpen={(val) => toggleOpen(val)}
      />
      <ul className="task-list-container">
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
        {filteredTasks.length === 0 && <h1>Task not found...</h1>}
      </ul>
    </>
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

  const handleTaskEdit = async (taskId, type = "edit") => {
    await setNewTask({
      type: type,
      id: taskId,
      title: task.title,
      content: task.content,
    });
    toggleOpen(true);
  };

  return (
    <li className="task-item">
      <section className="task-item__header">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.status}
          onChange={handleTaskCheck}
        />
        <h1 className="task-title">
          {task.title.trim() !== "" ? (
            task.title
          ) : (
            <span className="light-text">Empty task...</span>
          )}
        </h1>
      </section>

      <div className="__btns-container">
        <button
          className={`icon-btn-small ${task.status ? "success-btn" : ""}`}
          onClick={() => handleTaskCheck()}
        >
          <CheckIcon />
        </button>
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
    category === "All" ? "All" : category === true ? "Finished" : "Pending";

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
            className={`dropdown-btn default__tooltip-container ${title.toLowerCase()}-btn`}
          >
            <SortIcon />
            {title}
            <DropdownList>
              <DropdownItem onClick={() => setCategory("All")}>
                All
              </DropdownItem>
              <DropdownItem onClick={() => setCategory(false)}>
                Pending
              </DropdownItem>
              <DropdownItem onClick={() => setCategory(true)}>
                FInished
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

const DropdownList = (props) => {
  return <div className="dropdown-list">{props.children}</div>;
};

// ==================================

const DropdownItem = (props) => {
  return (
    <div onClick={props.onClick} className="dropdown-list__item btn-secondary">
      {props.children}
    </div>
  );
};

// ==================================

const Tooltip = (props) => {
  return <span className="default__tooltip">{props.children}</span>;
};
