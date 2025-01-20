import React from "react";
import ReactDOM from "react-dom/client"; // Vite uses React 18, so ReactDOM.createRoot is preferred
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
