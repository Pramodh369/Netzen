import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  const resolvedToken = token || localStorage.getItem("netzen_token");

  if (!resolvedToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}