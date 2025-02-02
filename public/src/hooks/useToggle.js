import { useState, useCallback } from "react";

export default function useToggle(defaultValue) {
  const [value, setValue] = useState(defaultValue);

  const toggleValue = useCallback(
    (value) => {
      setValue((currentValue) => (typeof value === "boolean" ? value : !currentValue));
    },
    [setValue]
  );

  return [value, toggleValue];
}
