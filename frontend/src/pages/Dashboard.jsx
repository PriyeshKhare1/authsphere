

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "manager") {
        navigate("/dashboard/manager");
      } else {
        navigate("/dashboard/user");
      }
    }
  }, [user, loading, navigate]);

  if (loading) return <Loader />;

  return null; // This page just redirects
}
