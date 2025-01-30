import React, { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useStorage";
import useToggle from "../hooks/useToggle";

export function TaskPage() {
  const [tasks, setTasks] = useLocalStorage("items", []);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useToggle(false);
  const [newTask, setNewTask] = useState({ title: "", content: "" });

  const handleTaskUpdate = (newTask) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => (task.id === newTask.id ? newTask : task));
    });
  };

  const handleTaskDelete = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
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
      <header>
        <button className="btn" onClick={() => setCategory("All")}>
          All
        </button>
        <button
          className="btn btn-orange-outline"
          onClick={() => setCategory(false)}
        >
          Pending
        </button>
        <button
          className="btn btn-green-outline"
          onClick={() => setCategory(true)}
        >
          Finished
        </button>
        <form className={`search-bar-container`}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Filter tasks..."
            className="search-bar"
          />
          <i className="fa fa-search icon-btn"></i>
        </form>
        <button className="btn">Add Task</button>
      </header>

      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Input title"
          value={newTask.title}
          onChange={(e) => {
            setNewTask((prev) => ({ ...prev, title: e.target.value }));
          }}
        />
        <input
          type="text"
          placeholder="Input content"
          value={newTask.content}
          onChange={(e) => {
            setNewTask((prev) => ({ ...prev, content: e.target.value }));
          }}
        />
        <button type="submit" className="btn-outline">
          Confirm
        </button>
      </form>

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
  const [checked, setChecked] = useState(false);

  const handleTaskCheck = (id) => {
    setChecked((prev) => {
      handleTaskUpdate({ ...task, status: !prev });
      return !prev;
    });
  };

  return (
    <li style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <p>Title: {task.title}</p>
      <p>Content: {task.content}</p>
      <p>Status: {task.status ? "Finished" : "Pending"}</p>
      <input
        type="checkbox"
        checked={task.status}
        onChange={() => handleTaskCheck(task.id)}
      />
      <button className="btn-outline" onClick={() => handleTaskDelete(task.id)}>
        Delete
      </button>
    </li>
  );
};
