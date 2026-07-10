import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Homepage, NotFound } from "./pages/chat";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Login from "./pages/Auth/Login";
import AccountListPage from "./pages/admin/AccountListPage";
import './App.css';

function App() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <Router>
      <Routes>
        {/* Default route to homepage */}
        <Route path="/" element={<Homepage />} />
        {/* Login route */}
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        {/* Admin route, only accessible via login button */}
        <Route
          path="/admin"
          element={
            <Navigate to="/login" replace />
          }
        />
        {/* New route for Account List page */}
        <Route
          path="/admin/accounts"
          element={<AccountListPage />}
        />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
