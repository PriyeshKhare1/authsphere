import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Admin from "../pages/Admin";
import UserDashboard from "../pages/UserDashboard";
import ManagerDashboard from "../pages/ManagerDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import UserToday from "../pages/UserToday";
import UserManagement from "../pages/UserManagement";

import ForgotPassword from "../pages/auth/ForgotPassword";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import AuthPage from "../pages/auth/AuthPage";
import TasksPage from "../pages/auth/TasksPage";
import EmailVerified from "../pages/auth/EmailVerified";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth & Dashboard */}
   
      <Route path="/" element={<AuthPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/verify-email/:token" element={<EmailVerified />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/Signup" element={<SignUp />} />
      <Route path="/tasks" element={<TasksPage />} />

      {/* Main Dashboard - redirects based on role */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* User Dashboard - Employee only */}
      <Route
        path="/dashboard/user"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Manager Dashboard - Manager only */}
      <Route
        path="/dashboard/manager"
        element={
          <ProtectedRoute>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      {/* Admin subpages */}
      <Route
        path="/admin/user-management"
        element={
          <AdminRoute>
            <UserManagement />
          </AdminRoute>
        }
      />
      
      <Route
        path="/admin/users/:id/today"
        element={
          <AdminRoute>
            <UserToday />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
