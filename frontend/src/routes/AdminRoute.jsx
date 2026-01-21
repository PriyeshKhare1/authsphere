import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function AdminRoute({ children }) {
  const auth = useAuth();
  const user = auth?.user;
  const loading = auth?.loading || false;

  if (loading) return <Loader />;

  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
