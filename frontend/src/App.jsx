import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./Pages/Dashboard";
import ViewMap from "./components/ViewMap/ViewMap";
import LoginForm from "./components/Login/LoginForm";
import SignupForm from "./components/Signup/SignupForm";
import ApproveUsers from "./components/ApproveUsers/ApproveUsers";
const App = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/", "/login", "/signup"];
  const shouldHideSidebarRoutes = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="app">
      {!shouldHideSidebarRoutes && <Sidebar />}
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view-map" element={<ViewMap />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/approve-users" element={<ApproveUsers />} />
      </Routes>
    </div>
  );
};

export default App;
