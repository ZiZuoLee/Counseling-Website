import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CounselorDashboard from './pages/CounselorDashboard';
import Appointment from './pages/Appointment';
import AdminDashboard from './pages/AdminDashboard';
import Chat from './pages/Chat';
import Hotline from './pages/Hotline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6EC6CA', // Soft teal
      light: '#A7FFEB',
      dark: '#0097A7',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FFD6E0', // Soft pink
      light: '#FFF1F7',
      dark: '#FFB6C1',
      contrastText: '#2c3e50',
    },
    background: {
      default: '#F7FAFC', // Very light, relaxing background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#607D8B',
    },
    success: {
      main: '#A5D6A7',
    },
    error: {
      main: '#FF8A80',
    },
    warning: {
      main: '#FFD54F',
    },
    info: {
      main: '#81D4FA',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '0.02em' },
    h2: { fontWeight: 600, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.75rem' },
    h4: { fontWeight: 600, fontSize: '1.5rem' },
    h5: { fontWeight: 500, fontSize: '1.25rem' },
    h6: { fontWeight: 500, fontSize: '1.1rem' },
    body1: { fontSize: '1rem', lineHeight: 1.7 },
    body2: { fontSize: '0.95rem', lineHeight: 1.6 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 16, // More rounded corners for a soft feel
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: '10px 24px',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(110, 198, 202, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 24px rgba(110, 198, 202, 0.10)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: '0 0 20px 20px',
          background: 'linear-gradient(90deg, #1DE9B6 0%, #00B8D4 100%)',
          color: '#2c3e50',
        },
      },
    },
  },
});

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({
  children,
  roles,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

// Role-based dashboard component
const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'counselor':
      return <CounselorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Dashboard />;
  }
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <RoleBasedDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointment"
                element={
                  <ProtectedRoute>
                    <Appointment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hotline"
                element={
                  <ProtectedRoute>
                    <Hotline />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
