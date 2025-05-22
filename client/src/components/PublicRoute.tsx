import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return authenticated ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
