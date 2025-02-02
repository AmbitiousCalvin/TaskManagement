import React, { useState, useEffect, useRef } from "react";
import "../styles/modalForm.scss";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { PriorityButton, DropdownList, DropdownItem } from "./utils";

function ModalForm({ open, onClose, handleAddTask, newTask = {}, setNewTask }) {
  const titleRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (open) {
      titleRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (titleRef.current) {
      handleHeight(titleRef);
    }
    if (textareaRef.current) {
      handleHeight(textareaRef);
    }
  }, [titleRef, textareaRef]);

  const handleHeight = (ref) => {
    if (ref.current) {
      ref.current.style.height = "min-content";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  const handleTaskPriority = (value) => {
    setNewTask((prev) => ({ ...prev, priority: value }));
  };

  return (
    <>
      <form
        className="form-container"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTask(newTask.id);
          onClose();
        }}
      >
        <section className="form-body" style={{ width: "100%" }}>
          <div className="default-title__container">
            <h1 className="form-title">
              {newTask.type === "edit" ? "Update Your Task" : "Add a New Task"}
            </h1>

            <PriorityButton className={`${newTask.priority}-btn`}>
              <FiberManualRecordIcon />
              {newTask.priority.toUpperCase()}
              <DropdownList>
                <DropdownItem onClick={() => handleTaskPriority("high")}>
                  High
                </DropdownItem>
                <DropdownItem onClick={() => handleTaskPriority("low")}>
                  Low
                </DropdownItem>
                <DropdownItem onClick={() => handleTaskPriority("medium")}>
                  Medium
                </DropdownItem>
              </DropdownList>
            </PriorityButton>
          </div>

          <div className="input-group">
            <label htmlFor="title-input">
              <h1>Title:</h1>
            </label>
            <textarea
              ref={titleRef}
              required
              placeholder="E.g., Buy groceries, Finish report..."
              value={newTask.title}
              id="title-input"
              onChange={(e) => {
                setNewTask((prev) => ({ ...prev, title: e.target.value }));
                handleHeight(titleRef);
              }}
            />
          </div>
          <div className="input-group">
            <label htmlFor="content-input">
              <h1>Details (Optional):</h1>
            </label>
            <textarea
              ref={textareaRef}
              placeholder="Add extra notes or details..."
              id="content-input"
              value={newTask.content}
              onChange={(e) => {
                setNewTask((prev) => ({ ...prev, content: e.target.value }));
                handleHeight(textareaRef);
              }}
            />
          </div>
        </section>
        <div
          className="__btns-container"
          style={{ width: "100%", justifyContent: "flex-end" }}
        >
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-green">
            {newTask.type === "edit" ? "Update Task" : "Add Task"}
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
