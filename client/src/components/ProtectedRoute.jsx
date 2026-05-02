import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = {
  admin: '/admin',
  student: '/student',
  company: '/company',
};

/**
 * Wraps a route to require authentication and optionally a specific role.
 * - No token → redirect to /login
 * - Wrong role → redirect to the user's own home page
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const fallback = ROLE_HOME[user.role] || '/login';
    return <Navigate to={fallback} replace />;
  }

  return children;
}
