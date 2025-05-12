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
  Tooltip,
  IconButton,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useAuth } from '../contexts/AuthContext';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'user',
    specialization: '',
    level: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.userType,
        formData.userType === 'counselor' ? formData.specialization : undefined,
        formData.userType === 'counselor' ? formData.level : undefined
      );
      
      // Redirect to dashboard after successful signup
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating account');
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
              Create Your Account
            </Typography>
            <Typography variant="body1" align="center" sx={{ color: 'text.secondary', mb: 2 }}>
              Join our supportive community and start your journey to well-being.
            </Typography>
          </Box>
          {(error || authError) && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error || authError}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleInputChange}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>User Type</InputLabel>
              <Select
                name="userType"
                value={formData.userType}
                label="User Type"
                onChange={handleSelectChange}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="counselor">Counselor</MenuItem>
              </Select>
            </FormControl>
            {formData.userType === 'counselor' && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="specialization"
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  InputProps={{ sx: { borderRadius: 3 } }}
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="level-label">Counselor Level</InputLabel>
                  <Select
                    labelId="level-label"
                    name="level"
                    value={formData.level}
                    label="Counselor Level"
                    onChange={handleSelectChange}
                    sx={{ borderRadius: 3 }}
                  >
                    <MenuItem value="intern">
                      实习级
                      <Tooltip title={<>
                        <div>• 心理学相关专业在读硕士<br/>• 累计咨询时长&lt;500小时<br/>服务定价区间: 58-88元/50分钟<br/>抽成比例: 5%</div>
                      </>} placement="right">
                        <IconButton size="small"><InfoOutlinedIcon fontSize="small" /></IconButton>
                      </Tooltip>
                    </MenuItem>
                    <MenuItem value="professional">
                      专业级
                      <Tooltip title={<>
                        <div>• 国家二级心理咨询师<br/>• 500+小时个案经验<br/>服务定价区间: 128-198元/50分钟<br/>抽成比例: 8%</div>
                      </>} placement="right">
                        <IconButton size="small"><InfoOutlinedIcon fontSize="small" /></IconButton>
                      </Tooltip>
                    </MenuItem>
                    <MenuItem value="expert">
                      专家级
                      <Tooltip title={<>
                        <div>• 副主任心理医师职称<br/>• 特定领域（如创伤治疗）认证资质<br/>服务定价区间: 258-398元/50分钟<br/>抽成比例: 12%</div>
                      </>} placement="right">
                        <IconButton size="small"><InfoOutlinedIcon fontSize="small" /></IconButton>
                      </Tooltip>
                    </MenuItem>
                    <MenuItem value="institution">
                      机构级
                      <Tooltip title={<>
                        <div>• 三甲医院心理科/知名心理咨询机构在职<br/>按机构标准溢价20%<br/>抽成比例: 15%</div>
                      </>} placement="right">
                        <IconButton size="small"><InfoOutlinedIcon fontSize="small" /></IconButton>
                      </Tooltip>
                    </MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              InputProps={{ sx: { borderRadius: 3 } }}
              helperText="At least 8 characters."
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3, mb: 2, borderRadius: 3, fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(110,198,202,0.10)' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>
            <Button
              fullWidth
              variant="text"
              color="secondary"
              onClick={() => navigate('/')}
              sx={{ borderRadius: 3, fontWeight: 600 }}
            >
              Already have an account? Log in
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup; 