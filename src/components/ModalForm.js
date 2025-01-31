import React, { useState, useEffect, useRef } from "react";

function ModalForm({ open, onClose, handleAddTask, newTask = {}, setNewTask }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <>
      <form
        className="form-container"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTask();
          onClose();
        }}
      >
        <h1>Add a new Task</h1>
        <section style={{ width: "100%" }}>
          <div className="input-group">
            <label htmlFor="title-input">Title:</label>
            <input
              ref={inputRef}
              required
              type="text"
              placeholder="Input title"
              value={newTask.title}
              id="title-input"
              onChange={(e) => {
                setNewTask((prev) => ({ ...prev, title: e.target.value }));
              }}
            />
          </div>
          <div className="input-group">
            <label htmlFor="content-input">Content:</label>
            <input
              type="text"
              placeholder="Input content"
              id="content-input"
              value={newTask.content}
              onChange={(e) => {
                setNewTask((prev) => ({ ...prev, content: e.target.value }));
              }}
            />
          </div>
        </section>
        <div
          className="__btns-container"
          style={{ width: "100%", justifyContent: "flex-end" }}
        >
          <button type="button" className="btn-outline" onClick={onClose}>
            Close
          </button>
          <button type="submit" className="btn-green">
            Save
          </button>
        </div>
      </form>

      <div
        onClick={onClose}
        className="page-overlay modal-overlay"
        role="button"
        aria-label="Close sidebar overlay"
        tabIndex="0"
      ></div>
    </>
  );
}

export default ModalForm;
