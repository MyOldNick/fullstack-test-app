import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return authenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
