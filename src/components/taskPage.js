import React, { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useStorage";
import useToggle from "../hooks/useToggle";

export function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [newTask, setNewTask] = useState({ title: "", content: "" });

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Filter tasks based on the selected category and search query
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "All") return true;
      return task.status === filter;
    })
    .filter((task) => {
      return task.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

  // Update localStorage when tasks are modified
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleCheckChange = (taskId) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, status: task.status === "Pending" ? "Finished" : "Pending" } : task))
    );
  };

  const handleDelete = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    console.log("Edit Task:", taskToEdit);
  };

  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.title.trim() && newTask.content.trim()) {
      const newTaskObj = {
        id: Date.now(),
        title: newTask.title,
        content: newTask.content,
        status: "Pending",
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask({ title: "", content: "" });
      setShowModal(false); // Close modal after adding task
    }
  };

  return (
    <div className="task-page">
      <header className="task-header">
        <input
          type="text"
          className="search-bar"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="categories">
          <button onClick={() => setFilter("All")}>All</button>
          <button onClick={() => setFilter("Finished")}>Finished</button>
          <button onClick={() => setFilter("Pending")}>Pending</button>
        </div>
        <button className="add-task-btn" onClick={() => setShowModal(true)}>
          Add Task
        </button>
      </header>

      <div className="task-grid">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-checkbox">
              <input type="checkbox" checked={task.status === "Finished"} onChange={() => handleCheckChange(task.id)} />
            </div>
            <div className="task-content">
              <h3>{task.title}</h3>
              <p>{task.content}</p>
            </div>
            <div className="task-buttons">
              <button onClick={() => handleEdit(task.id)}>Edit</button>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Task</h2>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Task Content"
                value={newTask.content}
                onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
                required
              />
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
