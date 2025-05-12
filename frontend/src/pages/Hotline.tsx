import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  ArrowBack as ArrowBackIcon,
  Call as CallIcon,
  Info as InfoIcon,
  LocalHospital as HospitalIcon,
  Security as SecurityIcon,
  Psychology as PsychologyIcon,
  Close as CloseIcon,
  VolunteerActivism as VolunteerActivismIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const emergencyContacts = [
  {
    id: 1,
    name: 'National Emergency Hotline',
    number: '120',
    description: '24/7 Emergency Services',
    icon: <CallIcon />,
    color: '#f44336',
  },
  {
    id: 2,
    name: 'Nationwide Mental Health Support Hotline',
    number: '12356',
    description: '24/7 Mental Health Support',
    icon: <PsychologyIcon />,
    color: '#2196f3',
  },
  {
    id: 3,
    name: 'Crisis Hotline',
    number: '400 821 1215',
    description: '24/7 Crisis Support and Counseling',
    icon: <SecurityIcon />,
    color: '#4caf50',
  },
];

const resourceLinks = [
  {
    title: 'Find Nearest Hospital',
    description: 'Locate the closest medical facility',
    icon: <HospitalIcon />,
    action: 'Find',
  },
  {
    title: 'Emergency Resources',
    description: 'Access crisis resources and information',
    icon: <InfoIcon />,
    action: 'View',
  },
  {
    title: 'Mental Health Support',
    description: 'Connect with mental health professionals',
    icon: <PsychologyIcon />,
    action: 'Connect',
  },
];

const Hotline = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Donation popup state
  const [donateOpen, setDonateOpen] = useState(false);
  const [donateAmount, setDonateAmount] = useState('');
  const [donateMsg, setDonateMsg] = useState('');
  const [donateSuccess, setDonateSuccess] = useState(false);

  const handleCall = (contact: any) => {
    setSelectedContact(contact);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setSelectedContact(null);
  };

  const handleConfirmCall = () => {
    if (selectedContact) {
      window.location.href = `tel:${selectedContact.number}`;
    }
    handleDialogClose();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <AppBar 
        position="static" 
        color="default" 
        elevation={1} 
        sx={{ 
          mb: 4,
          borderRadius: 2,
          background: 'linear-gradient(to right, #ffffff, #f8f9fa)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: '#2c3e50',
              fontWeight: 600
            }}
          >
            Emergency Hotline
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            startIcon={<VolunteerActivismIcon />}
            sx={{
              mr: 2,
              textTransform: 'none',
              borderRadius: 2,
              background: 'linear-gradient(90deg, #ffb300 0%, #ff7043 100%)',
              color: '#fff',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(90deg, #ffa000 0%, #ff5722 100%)',
              },
            }}
            onClick={() => setDonateOpen(true)}
          >
            捐赠
          </Button>
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

      <Alert 
        severity="warning" 
        sx={{ 
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        If this is a life-threatening emergency, please call 120 immediately.
      </Alert>

      <Grid container spacing={3}>
        {/* Emergency Contacts */}
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                color: '#2c3e50',
                fontWeight: 600,
                mb: 3
              }}
            >
              Emergency Contacts
            </Typography>
            <Grid container spacing={3}>
              {emergencyContacts.map((contact) => (
                <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }} key={contact.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      minHeight: '280px',
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      background: `linear-gradient(135deg, ${contact.color}08 0%, ${contact.color}15 100%)`,
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                        '& .contact-icon': {
                          transform: 'scale(1.1)',
                        }
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box 
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          mb: 3
                        }}
                      >
                        <Box 
                          className="contact-icon"
                          sx={{ 
                            backgroundColor: `${contact.color}15`,
                            borderRadius: '50%',
                            p: 2,
                            mr: 2,
                            transition: 'transform 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 64,
                            height: 64
                          }}
                        >
                          {React.cloneElement(contact.icon, { 
                            sx: { 
                              color: contact.color, 
                              fontSize: 32,
                              transition: 'transform 0.3s ease'
                            }
                          })}
                        </Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#2c3e50',
                            fontWeight: 600,
                            fontSize: '1.25rem'
                          }}
                        >
                          {contact.name}
                        </Typography>
                      </Box>
                      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            color: contact.color,
                            fontWeight: 700,
                            mb: 2,
                            fontSize: { xs: '2rem', sm: '2.5rem' },
                            textAlign: 'center',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {contact.number}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          color="text.secondary"
                          sx={{ 
                            textAlign: 'center',
                            mb: 3,
                            fontSize: '1rem',
                            lineHeight: 1.5
                          }}
                        >
                          {contact.description}
                        </Typography>
                      </Box>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PhoneIcon />}
                        onClick={() => handleCall(contact)}
                        sx={{
                          textTransform: 'none',
                          borderRadius: 2,
                          py: 1.5,
                          backgroundColor: contact.color,
                          fontSize: '1rem',
                          fontWeight: 600,
                          boxShadow: `0 4px 14px ${contact.color}40`,
                          '&:hover': {
                            backgroundColor: contact.color,
                            opacity: 0.9,
                            boxShadow: `0 6px 20px ${contact.color}60`,
                          }
                        }}
                      >
                        Call Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Quick Resources */}
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
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
              Quick Resources
            </Typography>
            <List>
              {resourceLinks.map((resource, index) => (
                <React.Fragment key={index}>
                  <ListItem 
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
                      {React.cloneElement(resource.icon, { 
                        sx: { color: '#2196f3' }
                      })}
                    </ListItemIcon>
                    <ListItemText
                      primary={resource.title}
                      secondary={resource.description}
                      primaryTypographyProps={{
                        sx: { color: '#2c3e50', fontWeight: 500 }
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        borderColor: '#2196f3',
                        color: '#2196f3',
                        '&:hover': {
                          borderColor: '#1976D2',
                          backgroundColor: 'rgba(33, 150, 243, 0.04)',
                        },
                      }}
                    >
                      {resource.action}
                    </Button>
                  </ListItem>
                  {index < resourceLinks.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Call Confirmation Dialog */}
      <Dialog 
        open={showDialog} 
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
          Confirm Call
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            You are about to call {selectedContact?.name} at {selectedContact?.number}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will redirect you to your phone's dialer.
          </Typography>
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
            onClick={handleConfirmCall}
            variant="contained"
            startIcon={<PhoneIcon />}
            sx={{ 
              textTransform: 'none',
              borderRadius: 1,
              backgroundColor: selectedContact?.color,
              '&:hover': {
                backgroundColor: selectedContact?.color,
                opacity: 0.9
              }
            }}
          >
            Call Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Donation Dialog */}
      <Dialog open={donateOpen} onClose={() => { setDonateOpen(false); setDonateSuccess(false); }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#ff7043' }}>支持我们 · 捐赠</DialogTitle>
        <DialogContent>
          {donateSuccess ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <VolunteerActivismIcon sx={{ fontSize: 48, color: '#ff7043', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>感谢您的支持！</Typography>
              <Typography variant="body2" color="text.secondary">您的捐赠（¥{donateAmount}）已收到。我们会继续努力帮助更多需要的人。</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>如果您获得了帮助，或希望支持我们让更多人受益，欢迎捐赠：</Typography>
              <TextField
                label="捐赠金额 (元)"
                type="number"
                value={donateAmount}
                onChange={e => setDonateAmount(e.target.value)}
                fullWidth
                inputProps={{ min: 1 }}
              />
              <TextField
                label="留言（可选）"
                value={donateMsg}
                onChange={e => setDonateMsg(e.target.value)}
                fullWidth
                multiline
                rows={2}
                placeholder="感谢平台/希望更多人受益..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setDonateOpen(false); setDonateSuccess(false); }} sx={{ textTransform: 'none', borderRadius: 2 }}>取消</Button>
          {!donateSuccess && (
            <Button
              variant="contained"
              color="secondary"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                background: 'linear-gradient(90deg, #ffb300 0%, #ff7043 100%)',
                color: '#fff',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(90deg, #ffa000 0%, #ff5722 100%)',
                },
              }}
              disabled={!donateAmount || Number(donateAmount) < 1}
              onClick={() => {
                // Save donation message to localStorage
                const prev = JSON.parse(localStorage.getItem('donationMessages') || '[]');
                prev.push({
                  msg: donateMsg,
                  amount: donateAmount,
                  time: new Date().toISOString(),
                });
                localStorage.setItem('donationMessages', JSON.stringify(prev));
                setDonateSuccess(true);
              }}
            >
              确认捐赠
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Hotline; 