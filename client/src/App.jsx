import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp, SignedIn } from '@clerk/clerk-react';
import { MantineProvider, createTheme, Box } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Dashboard from './pages/Dashboard';
import CreatePopup from './pages/CreatePopup';
import EditPopup from './pages/EditPopup';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import UpgradePage from './pages/UpgradePage';
import Navbar from './components/Navbar';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/Dashboard';
import Overview from './pages/admin/views/Overview';
import Users from './pages/admin/views/Users';
import Websites from './pages/admin/views/Websites';
import SecurityReports from './pages/admin/views/SecurityReports';
import Settings from './pages/admin/views/Settings';
import PlaygroundPage from './components/playground/PlaygroundPage';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const clerkConfig = {
  appearance: {
    baseTheme: undefined
  },
  signIn: {
    secondFactorMethods: ['totp'],
  },
  afterSignUpUrl: '/dashboard',
  afterSignInUrl: '/dashboard',
};

const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: ['#E7F5FF', '#D0EBFF', '#A5D8FF', '#74C0FC', '#4DABF7', '#339AF0', '#228BE6', '#1C7ED6', '#1971C2', '#1864AB'],
  },
});

function App() {
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      {...clerkConfig}
    >
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <Notifications position="top-center" zIndex={1000} />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Box>
            <Navbar />
          </Box>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
            <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
            <Route path="/upgrade" element={<UpgradePage />} />
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="create" element={<CreatePopup />} />
              <Route path="edit/:id" element={<EditPopup />} />
              <Route path="admin/*" element={
                <AdminRoute>
                  <Routes>
                    <Route element={<AdminDashboard />}>
                      <Route index element={<Overview />} />
                      <Route path="users" element={<Users />} />
                      <Route path="websites" element={<Websites />} />
                      <Route path="security" element={<SecurityReports />} />
                      <Route path="settings" element={<Settings />} />
                    </Route>
                  </Routes>
                </AdminRoute>
              } />
            </Route>
            {/* Playground Route */}
            <Route
              path="/playground"
              element={
                <SignedIn>
                  <PlaygroundPage />
                </SignedIn>
              }
            />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </ClerkProvider>
  );
}

export default App;
