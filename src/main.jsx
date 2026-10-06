import React from "react";
import { createRoot } from "react-dom/client";
import JobQuestGame from "./JobQuestGame.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <JobQuestGame />
  </React.StrictMode>,
);