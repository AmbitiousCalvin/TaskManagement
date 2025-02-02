import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LayoutContextProvider } from "./contexts/layoutContext";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <LayoutContextProvider>
      <App />
    </LayoutContextProvider>
  </StrictMode>
);
