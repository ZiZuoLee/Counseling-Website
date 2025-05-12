import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Logout as LogoutIcon,
  Chat as ChatIcon,
  Call as CallIcon,
} from '@mui/icons-material';
import { appointmentAPI, userAPI } from '../services/api';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';

interface AppointmentType {
  _id: string;
  date: string;
  user: string | { _id: string; name: string; email: string };
  counselor: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const CounselorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth() as { user: User | null; logout: () => void };
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    approvedAppointments: 0,
    rejectedAppointments: 0,
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAll();
      const counselorAppointments = response.data.filter(
        (appointment: AppointmentType) => appointment.counselor === user?._id
      );
      setAppointments(counselorAppointments);
      
      // Calculate stats
      setStats({
        totalAppointments: counselorAppointments.length,
        pendingAppointments: counselorAppointments.filter((a: AppointmentType) => a.status === 'pending').length,
        approvedAppointments: counselorAppointments.filter((a: AppointmentType) => a.status === 'approved').length,
        rejectedAppointments: counselorAppointments.filter((a: AppointmentType) => a.status === 'rejected').length,
      });
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    // Subscribe to real-time updates
    notificationService.connect();
    notificationService.subscribe('appointment:new', (data: AppointmentType) => {
      if (data.counselor === user?._id) {
        setAppointments(prev => [...prev, data]);
        setStats(prev => ({
          ...prev,
          totalAppointments: prev.totalAppointments + 1,
          pendingAppointments: prev.pendingAppointments + 1,
        }));
      }
    });

    notificationService.subscribe('appointment:status', (data: AppointmentType) => {
      if (data.counselor === user?._id) {
        setAppointments(prev =>
          prev.map(appointment =>
            appointment._id === data._id ? data : appointment
          )
        );
        // Update stats based on status change
        setStats(prev => {
          const newStats = { ...prev };
          if (data.status === 'approved') {
            newStats.pendingAppointments--;
            newStats.approvedAppointments++;
          } else if (data.status === 'rejected') {
            newStats.pendingAppointments--;
            newStats.rejectedAppointments++;
          }
          return newStats;
        });
      }
    });

    return () => {
      notificationService.disconnect();
    };
  }, [user]);

  const handleAppointmentAction = async (appointmentId: string, action: 'approve' | 'reject') => {
    try {
      const status = action === 'approve' ? 'approved' : 'rejected';
      await appointmentAPI.update(appointmentId, { status });
      
      // Immediately update the appointments state
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );

      // Update stats
      setStats(prev => {
        const newStats = { ...prev };
        if (status === 'approved') {
          newStats.pendingAppointments--;
          newStats.approvedAppointments++;
        } else if (status === 'rejected') {
          newStats.pendingAppointments--;
          newStats.rejectedAppointments++;
        }
        return newStats;
      });

      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error(`Error ${action}ing appointment:`, err);
      setError(`Failed to ${action} appointment. Please try again.`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChatClick = () => {
    navigate('/chat');
  };

  const handleHotlineClick = () => {
    navigate('/hotline');
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
      <AppBar position="static" color="default" elevation={1} sx={{ mb: 4, borderRadius: 3, background: 'linear-gradient(90deg, #1DE9B6 0%, #00B8D4 100%)', boxShadow: '0 4px 24px rgba(110,198,202,0.10)' }}>
        <Toolbar>
          <img src={require('../logo/Anahata White.png')} alt="Counseling Logo" style={{ width: 80, marginRight: 16, borderRadius: 8 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Counselor Dashboard
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
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
        {/* Welcome Section */}
        <Grid sx={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ width: '100%', maxWidth: 900, p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.name}
            </Typography>
            <Typography variant="body1">
              Manage your appointments and help those in need.
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' }, display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ width: '100%', maxWidth: 400, p: 3, display: 'flex', flexDirection: 'column', height: 240, borderRadius: 3, boxShadow: '0 4px 24px rgba(110,198,202,0.10)' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <List sx={{ gap: 1 }}>
              <ListItem component="button" onClick={handleChatClick} sx={{ borderRadius: 2, mb: 1, p: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<ChatIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(110,198,202,0.10)',
                    py: 1.5,
                  }}
                >
                  Start Chat Session
                </Button>
              </ListItem>
              <ListItem component="button" onClick={handleHotlineClick} sx={{ borderRadius: 2, p: 0 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<CallIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    borderWidth: 2,
                  }}
                >
                  Emergency Hotline
                </Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Stats Section */}
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 3' }, display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ width: '100%', maxWidth: 300, p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" gutterBottom>
              Total Appointments
            </Typography>
            <Typography variant="h3">{stats.totalAppointments}</Typography>
          </Paper>
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 3' }, display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ width: '100%', maxWidth: 300, p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" gutterBottom>
              Pending
            </Typography>
            <Typography variant="h3">{stats.pendingAppointments}</Typography>
          </Paper>
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 3' }, display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ width: '100%', maxWidth: 300, p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" gutterBottom>
              Approved
            </Typography>
            <Typography variant="h3">{stats.approvedAppointments}</Typography>
          </Paper>
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 3' }, display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ width: '100%', maxWidth: 300, p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" gutterBottom>
              Rejected
            </Typography>
            <Typography variant="h3">{stats.rejectedAppointments}</Typography>
          </Paper>
        </Grid>

        {/* Pending Appointments */}
        <Grid sx={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ width: '100%', maxWidth: 900, p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Pending Appointments
            </Typography>
            <List>
              {appointments
                .filter(appointment => appointment.status === 'pending')
                .map((appointment) => (
                  <React.Fragment key={appointment._id}>
                    <ListItem>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Appointment with ${renderUserName(appointment.user)}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {new Date(appointment.date).toLocaleString()}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              Reason: {appointment.reason}
                            </Typography>
                          </>
                        }
                      />
                      <Box>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckIcon />}
                          onClick={() => handleAppointmentAction(appointment._id, 'approve')}
                          sx={{ mr: 1 }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<CloseIcon />}
                          onClick={() => handleAppointmentAction(appointment._id, 'reject')}
                        >
                          Reject
                        </Button>
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Approved Appointments */}
        <Grid sx={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ width: '100%', maxWidth: 900, p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Approved Appointments
            </Typography>
            <List>
              {appointments
                .filter(appointment => appointment.status === 'approved')
                .map((appointment) => (
                  <ListItem key={appointment._id}>
                    <ListItemIcon>
                      <ScheduleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Appointment with ${renderUserName(appointment.user)}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            {new Date(appointment.date).toLocaleString()}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Reason: {appointment.reason}
                          </Typography>
                        </>
                      }
                    />
                    <Chip
                      label="Approved"
                      color="success"
                      size="small"
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        {/* Rejected Appointments */}
        <Grid sx={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ width: '100%', maxWidth: 900, p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Rejected Appointments
            </Typography>
            <List>
              {appointments
                .filter(appointment => appointment.status === 'rejected')
                .map((appointment) => (
                  <ListItem key={appointment._id}>
                    <ListItemIcon>
                      <CloseIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Appointment with ${renderUserName(appointment.user)}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            {new Date(appointment.date).toLocaleString()}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Reason: {appointment.reason}
                          </Typography>
                        </>
                      }
                    />
                    <Chip
                      label="Rejected"
                      color="error"
                      size="small"
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CounselorDashboard; 