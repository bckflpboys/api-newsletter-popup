import { Outlet, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Box } from '@mantine/core';

function Layout() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/" />;
  }

  return (
    <Box
      sx={{
        background: '#f8f9fa',
        minHeight: '100vh',
        width: '100%',
        padding: 0
      }}
    >
      <Outlet />
    </Box>
  );
}

export default Layout;