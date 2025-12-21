import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
    const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/check`, {
          credentials: 'include'
        });
        


         if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.isAuthenticated);
          setUserRole(data.userRole);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };


    checkAuth();
  }, [location.pathname]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    const redirectTo = userRole === 'organiser' ? '/organiser/dashboard' : '/user/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;