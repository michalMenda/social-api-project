import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Navigate, Route } from "react-router-dom";
import Login from "./login";
import Signup from "./Signup";
import UserPage from './UserPage';
import '../css/App.css';
export const userContext = createContext();

function App() {
  const [userData, setUserData] = useState(localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")) : null);
  return (<userContext.Provider value={{ userData, setUserData }}>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/home" element={<UserPage />} />
        <Route path="/users/:id/*" element={<UserPage />} />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Router>
  </userContext.Provider>
  );
}

export default App;
