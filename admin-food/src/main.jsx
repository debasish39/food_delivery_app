import React from "react";

import ReactDOM from "react-dom/client";
import "./index.css";
import {
  BrowserRouter,
} from "react-router-dom";
import "leaflet/dist/leaflet.css";
import {
  AuthProvider,
} from "./context/AuthContext";

import App from "./App";

ReactDOM.createRoot(
  document.getElementById(
    "root"
  )
).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);