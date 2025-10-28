import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { UserDataContext } from "./context/userContext";


const App = () => {
  const { userData } = useContext(UserDataContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={userData ? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={userData ? <Navigate to="/" /> : <Signup />} />
        <Route path="/login" element={userData ? <Navigate to="/" /> : <Login />} />
      </Routes>
    </div>
  );
};

export default App;
