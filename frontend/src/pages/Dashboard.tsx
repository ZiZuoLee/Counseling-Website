import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Chip,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Event as EventIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  Call as CallIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { appointmentAPI, userAPI } from '../services/api';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

// Add types for counselors and appointments
interface CounselorType {
  _id: string;
  name: string;
  specialization: string;
  availability?: string[];
  rating?: number;
  level?: 'intern' | 'professional' | 'expert' | 'institution';
}

interface AppointmentType {
  _id: string;
  date: string;
  user: string | { _id: string; name: string; email: string };
  counselor: string | { _id: string; name: string; email: string; specialization: string };
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth() as { user: User | null; logout: () => void };
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [counselors, setCounselors] = useState<CounselorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationMessages, setDonationMessages] = useState<{msg: string, amount: string, time: string}[]>([]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentAPI.getAll();
      setAppointments(response.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchCounselors = async () => {
    try {
      const response = await userAPI.getCounselors();
      setCounselors(response.data);
    } catch (err) {
      console.error('Error fetching counselors:', err);
      setError('Failed to fetch counselors');
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchCounselors();

    // Subscribe to real-time updates
    notificationService.connect();
    notificationService.subscribe('appointment:new', (data: AppointmentType) => {
      if (data.user === user?._id || data.counselor === user?._id) {
        setAppointments(prev => [...prev, data]);
      }
    });

    notificationService.subscribe('appointment:status', (data: AppointmentType) => {
      if (data.user === user?._id || data.counselor === user?._id) {
        setAppointments(prev =>
          prev.map(appointment =>
            appointment._id === data._id ? data : appointment
          )
        );
      }
    });

    // Fetch donation messages from localStorage
    const msgs = JSON.parse(localStorage.getItem('donationMessages') || '[]');
    setDonationMessages(msgs.reverse()); // show latest first

    return () => {
      notificationService.disconnect();
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHotlineClick = () => {
    navigate('/hotline');
  };

  const handleAppointmentClick = () => {
    navigate('/appointment');
  };

  const handleChatClick = () => {
    navigate('/chat');
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'approved':
        return <Chip icon={<CheckCircleIcon />} label="Approved" color="success" size="small" />;
      case 'rejected':
        return <Chip icon={<CancelIcon />} label="Rejected" color="error" size="small" />;
      default:
        return <Chip icon={<ScheduleIcon />} label="Pending" color="warning" size="small" />;
    }
  };

  const renderCounselorName = (counselor: string | { _id: string; name: string; email: string; specialization: string }) => {
    if (typeof counselor === 'object' && counselor !== null) {
      return counselor.name;
    }
    return counselor;
  };

  const renderUserName = (user: string | { _id: string; name: string; email: string }) => {
    if (typeof user === 'object' && user !== null) {
      return user.name;
    }
    return user;
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      sx={{ 
        minHeight: '100vh', 
        width: '100%',
        background: 'linear-gradient(90deg, #A7FFEB 0%, #FFD6E0 100%)', 
        py: 4,
        px: { xs: 2, md: 4 },
        overflow: 'auto',
        boxSizing: 'border-box'
      }}
    >
      <AppBar 
        position="static" 
        color="default" 
        elevation={1} 
        sx={{ 
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #1DE9B6 0%, #00B8D4 100%)',
          boxShadow: '0 4px 24px rgba(110,198,202,0.10)'
        }}
      >
        <Toolbar>
          <img src={require('../logo/Anahata White.png')} alt="Counseling Logo" style={{ width: 80, marginRight: 16, borderRadius: 8 }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: '#2c3e50',
              fontWeight: 700
            }}
          >
            Welcome, {user?.name}
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              textTransform: 'none',
              borderRadius: 3,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
        {/* Quick Actions */}
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' }, display: 'flex', justifyContent: 'center' }}>
          <Paper 
            sx={{ 
              width: '100%',
              maxWidth: 400,
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 240,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 4px 24px rgba(110,198,202,0.10)'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                color: '#2c3e50',
                fontWeight: 600,
                mb: 2
              }}
            >
              Quick Actions
            </Typography>
            <List>
              <ListItem 
                component="button" 
                onClick={handleChatClick}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.08)'
                  }
                }}
              >
                <ListItemIcon>
                  <ChatIcon sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Start Chat Session" 
                  primaryTypographyProps={{
                    sx: { color: '#2c3e50', fontWeight: 500 }
                  }}
                />
              </ListItem>
              <ListItem 
                component="button" 
                onClick={handleHotlineClick}
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.08)'
                  }
                }}
              >
                <ListItemIcon>
                  <CallIcon sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Emergency Hotline" 
                  primaryTypographyProps={{
                    sx: { color: '#2c3e50', fontWeight: 500 }
                  }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Pending Appointments */}
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' }, display: 'flex', justifyContent: 'center' }}>
          <Paper 
            sx={{ 
              width: '100%',
              maxWidth: 600,
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 240,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 4px 24px rgba(110,198,202,0.10)'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                color: '#2c3e50',
                fontWeight: 600,
                mb: 2
              }}
            >
              Pending Appointments
            </Typography>
            <List sx={{ overflow: 'auto' }}>
              {appointments
                .filter(appointment => {
                  if (user?.role === 'counselor') {
                    return appointment.status === 'pending' && appointment.counselor === user._id;
                  }
                  return appointment.status === 'pending' && appointment.user === user?._id;
                })
                .map((appointment) => (
                  <ListItem 
                    key={appointment._id}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: 'white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      '&:hover': {
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <EventIcon sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={appointment.reason}
                      primaryTypographyProps={{
                        sx: { color: '#2c3e50', fontWeight: 500 }
                      }}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" sx={{ color: '#666' }}>
                            {new Date(appointment.date).toLocaleString()}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" sx={{ color: '#666' }}>
                            {user?.role === 'counselor' 
                              ? `User: ${renderUserName(appointment.user)}`
                              : `Counselor: ${renderCounselorName(appointment.counselor)}`}
                          </Typography>
                        </>
                      }
                    />
                    {getStatusChip(appointment.status)}
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        {/* Appointment History */}
        <Grid sx={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'center' }}>
          <Paper 
            sx={{ 
              width: '100%',
              maxWidth: 900,
              p: 3, 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 4px 24px rgba(110,198,202,0.10)'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                color: '#2c3e50',
                fontWeight: 600,
                mb: 2
              }}
            >
              Appointment History
            </Typography>
            <List>
              {appointments
                .filter(appointment => {
                  if (user?.role === 'counselor') {
                    return appointment.status !== 'pending' && appointment.counselor === user._id;
                  }
                  return appointment.status !== 'pending' && appointment.user === user?._id;
                })
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((appointment) => (
                  <ListItem 
                    key={appointment._id}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: 'white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      '&:hover': {
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      {appointment.status === 'approved' ? (
                        <CheckCircleIcon sx={{ color: 'primary.main' }} />
                      ) : (
                        <CancelIcon sx={{ color: 'error.main' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={appointment.reason}
                      primaryTypographyProps={{
                        sx: { color: '#2c3e50', fontWeight: 500 }
                      }}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" sx={{ color: '#666' }}>
                            {new Date(appointment.date).toLocaleString()}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" sx={{ color: '#666' }}>
                            {user?.role === 'counselor' 
                              ? `User: ${renderUserName(appointment.user)}`
                              : `Counselor: ${renderCounselorName(appointment.counselor)}`}
                          </Typography>
                        </>
                      }
                    />
                    {getStatusChip(appointment.status)}
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        {/* Available Counselors */}
        <Grid sx={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'center' }}>
          <Paper 
            sx={{ 
              width: '100%',
              maxWidth: 900,
              p: 3, 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 4px 24px rgba(110,198,202,0.10)'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                color: '#2c3e50',
                fontWeight: 600,
                mb: 2
              }}
            >
              Available Counselors
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {counselors.map((counselor) => (
                <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' }, display: 'flex', justifyContent: 'center' }} key={counselor._id}>
                  <Card 
                    sx={{ 
                      width: '100%',
                      maxWidth: 350,
                      borderRadius: 2,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      '&:hover': {
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#2c3e50',
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        {counselor.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {counselor.specialization}
                      </Typography>
                      {counselor.level && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          等级: {counselor.level === 'intern' ? '实习级' : counselor.level === 'professional' ? '专业级' : counselor.level === 'expert' ? '专家级' : counselor.level === 'institution' ? '机构级' : counselor.level}
                        </Typography>
                      )}
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Availability: {counselor.availability?.join(', ') || 'Not specified'}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                      >
                        Rating: {counselor.rating || 'N/A'}/5.0
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        onClick={() => navigate('/appointment')}
                        sx={{
                          textTransform: 'none',
                          borderRadius: 1,
                          color: '#2196f3'
                        }}
                      >
                        Book Session
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => navigate('/chat')}
                        sx={{
                          textTransform: 'none',
                          borderRadius: 1,
                          color: '#2196f3'
                        }}
                      >
                        Chat Now
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Donation Comments Section */}
      {donationMessages.length > 0 && (
        <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
          <Paper sx={{ p: 4, borderRadius: 2, background: 'linear-gradient(135deg, #fffbe7 0%, #fff3e0 100%)', boxShadow: '0 2px 8px rgba(255, 167, 38, 0.08)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <VolunteerActivismIcon sx={{ color: '#ff7043', fontSize: 32, mr: 1 }} />
              <Typography variant="h6" sx={{ color: '#ff7043', fontWeight: 600 }}>
                用户留言与感谢
              </Typography>
            </Box>
            <List>
              {donationMessages.map((item, idx) => (
                <ListItem key={idx} alignItems="flex-start" sx={{ borderBottom: '1px solid #ffe0b2', pb: 2 }}>
                  <ListItemIcon>
                    <VolunteerActivismIcon sx={{ color: '#ffb300' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<>
                      <Typography variant="subtitle2" sx={{ color: '#ff7043', fontWeight: 500 }}>
                        热心网友
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#333', mt: 0.5 }}>{item.msg || '（无留言）'}</Typography>
                    </>}
                    secondary={<>
                      <Typography variant="caption" sx={{ color: '#888' }}>
                        捐赠金额：¥{item.amount} &nbsp;|&nbsp; {new Date(item.time).toLocaleString()}
                      </Typography>
                    </>}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Container>
      )}
    </Container>
  );
};

export default Dashboard; 