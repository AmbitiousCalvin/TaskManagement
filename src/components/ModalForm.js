import React, { useState } from "react";

function ModalForm({ open, onClose, handleAddTask, newTask = {}, setNewTask }) {
  return (
    open && (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTask();
          onClose();
        }}
      >
        <div className="input-group">
          <label htmlFor="title-input">Title:</label>
          <input
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
        <button type="submit" className="btn-outline">
          Confirm
        </button>
      </form>
    )
  );
}

export default ModalForm;
