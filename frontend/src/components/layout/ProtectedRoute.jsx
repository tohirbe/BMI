import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser }  from "../../store/authSlice";
import { usePermissions } from "../../hooks/usePermissions";

export default function ProtectedRoute({ children, menuKey }) {
  const user = useSelector(selectUser);
  const { can, loaded } = usePermissions();

  if (!user) return <Navigate to="/login" replace />;

  if (menuKey && loaded && !can(menuKey)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}