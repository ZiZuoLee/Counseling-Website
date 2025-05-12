import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { SelectChangeEvent } from '@mui/material/Select';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password, formData.userType);
      
      // Redirect based on user type
      if (formData.userType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(90deg, #A7FFEB 0%, #FFD6E0 100%)', py: 8 }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={4} sx={{ p: 5, borderRadius: 4, boxShadow: '0 8px 32px rgba(110,198,202,0.10)', background: 'rgba(255,255,255,0.95)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <img src={require('../logo/Anahata Logo.png')} alt="Counseling Logo" style={{ width: 120, marginBottom: 20 }} />
            <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" align="center" sx={{ color: 'text.secondary', mb: 2 }}>
              Log in to continue your journey to well-being.
            </Typography>
          </Box>
          {(error || authError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || authError}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>User Type</InputLabel>
              <Select
                name="userType"
                value={formData.userType}
                label="User Type"
                onChange={handleSelectChange}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="counselor">Counselor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/signup')}
              disabled={loading}
            >
              Don't have an account? Sign Up
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 