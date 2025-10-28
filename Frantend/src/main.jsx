import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthContext from "./context/AuthContext.jsx";
import UserContext from "./context/userContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContext>
        <UserContext>
          <App />
        </UserContext>
      </AuthContext>
    </BrowserRouter>
  </React.StrictMode>
);
