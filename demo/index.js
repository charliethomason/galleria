import React from "react";
import { createRoot } from "react-dom/client";
import "core-js/stable";
import App from "./App.jsx";

const wrapper = document.getElementById("app");
const root = createRoot(wrapper);
root.render(<App />);
