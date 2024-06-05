import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { BrowserRouter as Router } from "react-router-dom";
import AlojamientoContextProvider from "./cases/AlojamientoContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AlojamientoContextProvider>
    <Router>
      <App />
    </Router>
  </AlojamientoContextProvider>
);
