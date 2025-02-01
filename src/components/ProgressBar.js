import { useEffect, useState } from "react";

export const ProgressBar = ({ finishedTasksCount, totalTasks }) => {
  return (
    <progress
      className="progress-bar"
      value={finishedTasksCount}
      min="0"
      max={totalTasks}
    ></progress>
  );
};
