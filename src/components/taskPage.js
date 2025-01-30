import React, { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useStorage";
import useToggle from "../hooks/useToggle";
import ModalForm from "./ModalForm";
import "../styles/tasks.scss";

export function TaskPage() {
  const [tasks, setTasks] = useLocalStorage("items", []);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useToggle(false);
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

  const handleAddTask = () => {
    setTasks((prevTasks) => {
      return [
        ...prevTasks,
        { ...newTask, id: crypto.randomUUID(), status: false },
      ];
    });
    setNewTask({ title: "", content: "" });
  };

  return (
    <>
      <h1>Task Page</h1>
      <header className="task-header">
        <section>
          <div className="task-header__btns">
            <button className="btn" onClick={() => setCategory("All")}>
              All
            </button>
            <button className="btn-amber" onClick={() => setCategory(false)}>
              Pending
            </button>
            <button className="btn-green" onClick={() => setCategory(true)}>
              Finished
            </button>
          </div>
        </section>
        <section>
          <form className="search-bar-container">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Filter tasks..."
              className="search-bar"
            />
            <i className="fa fa-search icon-btn"></i>
          </form>
          <div className="task-header__btns">
            <button className="btn btn-add-task">Add Task</button>
            <button
              className="btn-outline btn-open-modal"
              onClick={() => toggleOpen(true)}
            >
              Open Modal
            </button>
          </div>
        </section>
      </header>

      <ModalForm
        open={open}
        onClose={() => toggleOpen(false)}
        handleAddTask={handleAddTask}
        newTask={newTask}
        setNewTask={setNewTask}
      />
      <ul>
        <h1>This is Task List</h1>
        {tasks
          .filter((task) => {
            if (category === "All") return task;
            return task.status === category;
          })
          .filter((task) => {
            if (searchQuery === "") return task;
            return task.title.toLowerCase().includes(searchQuery.toLowerCase());
          })
          .map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              handleTaskUpdate={handleTaskUpdate}
              handleTaskDelete={handleTaskDelete}
            />
          ))}
      </ul>
    </>
  );
}

const TaskItem = ({ task, handleTaskUpdate, handleTaskDelete }) => {
  const handleTaskCheck = () => {
    handleTaskUpdate({ ...task, status: !task.status });
  };

  return (
    <li style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <p>Title: {task.title}</p>
      <p>Content: {task.content}</p>
      <p>Status: {task.status ? "Finished" : "Pending"}</p>
      <input type="checkbox" checked={task.status} onChange={handleTaskCheck} />
      <button className="btn-outline" onClick={() => handleTaskDelete(task.id)}>
        Delete
      </button>
    </li>
  );
};
