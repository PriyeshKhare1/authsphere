import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  const user = auth?.user;
  const loading = auth?.loading || false;

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/" replace />;

  return children;
}
