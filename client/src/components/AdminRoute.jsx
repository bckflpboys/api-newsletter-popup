import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) {
    return null; // or a loading spinner
  }

  const isAdmin = user?.publicMetadata?.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
