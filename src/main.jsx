import React from "react";
import { createRoot } from "react-dom/client";
import MisionCuidadoGame from "./MisionCuidadoGame.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MisionCuidadoGame />
  </React.StrictMode>,
);