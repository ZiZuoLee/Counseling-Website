import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  AppBar,
  Toolbar,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { appointmentAPI, userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

// Add types for appointments and counselors
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
  counselor: string | { _id: string; name: string; email: string; specialization: string };
  user: string | { _id: string; name: string; email: string };
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'online' | 'offline';
}

const Appointment = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [reason, setReason] = useState('');
  const [appointmentType, setAppointmentType] = useState<'online' | 'offline'>('online');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null);
  const [counselors, setCounselors] = useState<CounselorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch counselors
        const counselorsResponse = await userAPI.getCounselors();
        setCounselors(counselorsResponse.data);

        // Fetch appointments
        const appointmentsResponse = await appointmentAPI.getAll();
        setAppointments(appointmentsResponse.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedCounselor || !reason) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error',
      });
      return;
    }

    try {
      const response = await appointmentAPI.create({
        counselorId: selectedCounselor,
        date: selectedDate,
        reason: reason,
        type: appointmentType
      });

      setAppointments([...appointments, response.data]);
      setSnackbar({
        open: true,
        message: 'Appointment request sent successfully',
        severity: 'success',
      });

      // Reset form
      setSelectedDate(new Date());
      setSelectedCounselor('');
      setReason('');
      setAppointmentType('online');
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to book appointment',
        severity: 'error',
      });
    }
  };

  const handleAppointmentAction = (appointment: AppointmentType, action: 'approve' | 'reject') => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
  };

  const handleDialogConfirm = async () => {
    if (!selectedAppointment) return;

    try {
      const newStatus = selectedAppointment.status === 'pending' ? 'approved' : 'rejected';
      await appointmentAPI.update(selectedAppointment._id, { status: newStatus });

      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment._id === selectedAppointment._id
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

      setSnackbar({
        open: true,
        message: `Appointment ${newStatus} successfully`,
        severity: newStatus === 'approved' ? 'success' : 'info',
      });

      handleDialogClose();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update appointment status',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderUserName = (user: string | { _id: string; name: string; email: string }) => {
    if (typeof user === 'object' && user !== null) {
      return user.name;
    }
    return user;
  };

  const renderCounselorName = (counselor: string | { _id: string; name: string; email: string; specialization: string }) => {
    if (typeof counselor === 'object' && counselor !== null) {
      return counselor.name;
    }
    return counselor;
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
          borderRadius: 2,
          background: 'linear-gradient(90deg, #1DE9B6 0%, #00B8D4 100%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
              fontWeight: 600
            }}
          >
            {user?.role === 'user' ? 'Book an Appointment' : 'Manage Appointments'}
          </Typography>
          <Button
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Back to Dashboard
          </Button>
        </Toolbar>
      </AppBar>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)',
          mb: 4
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: '#2c3e50',
            fontWeight: 600,
            mb: 3,
            textAlign: 'center'
          }}
        >
          {user?.role === 'user' ? 'Book an Appointment' : 'Manage Appointments'}
        </Typography>

        <Grid container spacing={3}>
          {user?.role === 'user' ? (
            // User View - Book Appointment
            <Grid sx={{ gridColumn: 'span 12' }}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 4, 
                  borderRadius: 2,
                  background: 'white',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Grid container spacing={3}>
                  <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <FormControl fullWidth>
                      <InputLabel>Select Counselor</InputLabel>
                      <Select
                        value={selectedCounselor}
                        label="Select Counselor"
                        onChange={(e) => setSelectedCounselor(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2196f3',
                          },
                        }}
                      >
                        {counselors.map((counselor) => (
                          <MenuItem key={counselor._id} value={counselor._id}>
                            {counselor.name} - {counselor.specialization}
                            {counselor.level && (
                              <>（{counselor.level === 'intern' ? '实习级' : counselor.level === 'professional' ? '专业级' : counselor.level === 'expert' ? '专家级' : counselor.level === 'institution' ? '机构级' : counselor.level}）</>
                            )}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <DateTimePicker
                      label="Select Date and Time"
                      value={selectedDate}
                      onChange={(newValue: Date | null) => setSelectedDate(newValue)}
                      sx={{ 
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#2196f3',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <FormControl fullWidth>
                      <InputLabel>Appointment Type</InputLabel>
                      <Select
                        value={appointmentType}
                        label="Appointment Type"
                        onChange={(e) => setAppointmentType(e.target.value as 'online' | 'offline')}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2196f3',
                          },
                        }}
                      >
                        <MenuItem value="online">Online (Video Call)</MenuItem>
                        <MenuItem value="offline">Offline (In-Person)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid sx={{ gridColumn: 'span 12' }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Reason for Appointment"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#2196f3',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid sx={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleBookAppointment}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                        },
                      }}
                    >
                      Book Appointment
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ) : (
            // Counselor View - Manage Appointments
            <Grid sx={{ gridColumn: 'span 12' }}>
              <TableContainer 
                component={Paper} 
                elevation={2}
                sx={{ 
                  borderRadius: 2,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow 
                        key={appointment._id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: '#f8f9fa' 
                          }
                        }}
                      >
                        <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
                        <TableCell>{renderUserName(appointment.user)}</TableCell>
                        <TableCell>
                          <Chip
                            label={appointment.type === 'online' ? 'Online' : 'Offline'}
                            color={appointment.type === 'online' ? 'primary' : 'secondary'}
                            size="small"
                            sx={{ 
                              borderRadius: 1,
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>{appointment.reason}</TableCell>
                        <TableCell>
                          <Chip
                            label={appointment.status}
                            color={
                              appointment.status === 'approved' 
                                ? 'success' 
                                : appointment.status === 'rejected' 
                                  ? 'error' 
                                  : 'warning'
                            }
                            size="small"
                            sx={{ 
                              borderRadius: 1,
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {appointment.status === 'pending' && (
                            <>
                              <Button
                                size="small"
                                color="success"
                                onClick={() => handleAppointmentAction(appointment, 'approve')}
                                sx={{ 
                                  mr: 1,
                                  textTransform: 'none',
                                  borderRadius: 1
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleAppointmentAction(appointment, 'reject')}
                                sx={{ 
                                  textTransform: 'none',
                                  borderRadius: 1
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#2c3e50',
          fontWeight: 600
        }}>
          {selectedAppointment?.status === 'pending' ? 'Approve' : 'Reject'} Appointment
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to {selectedAppointment?.status === 'pending' ? 'approve' : 'reject'} this appointment?
          </Typography>
          <Box sx={{ 
            mt: 2,
            p: 2,
            backgroundColor: '#f8f9fa',
            borderRadius: 1
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Appointment Details:</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>Date: {selectedAppointment?.date}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              User: {selectedAppointment ? renderUserName(selectedAppointment.user) : ''}
            </Typography>
            <Typography variant="body2">Reason: {selectedAppointment?.reason}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleDialogClose}
            sx={{ 
              textTransform: 'none',
              borderRadius: 1
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDialogConfirm} 
            color="primary" 
            autoFocus
            sx={{ 
              textTransform: 'none',
              borderRadius: 1
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ 
            borderRadius: 1,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Appointment; 