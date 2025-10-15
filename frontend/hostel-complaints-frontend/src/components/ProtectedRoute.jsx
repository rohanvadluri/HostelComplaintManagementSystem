import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Check if admin info exists in localStorage
  const isLoggedIn = !!localStorage.getItem("admin"); // true if admin is logged in
  return isLoggedIn ? children : <Navigate to="/admin-login" />;
}

export default ProtectedRoute;
