import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("cms-token");

  // ❌ No token → kick out
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // ❌ Expired token → clear + redirect
    if (!decoded?.exp || decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("cms-token");
      localStorage.removeItem("admin-user");
      localStorage.removeItem("admin-auth");

      return <Navigate to="/login" replace />;
    }

    // ✅ Valid token → allow access
    return children;

  } catch (err) {
    // ❌ Broken/invalid token → clear everything
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;