import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Chip,
  Rating,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Call as CallIcon,
  Info as InfoIcon,
  LocalHospital as HospitalIcon,
  Security as SecurityIcon,
  Psychology as PsychologyIcon,
  Close as CloseIcon,
  Circle as CircleIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, chatAPI } from '../services/api';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  senderId: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  specialization?: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useAuth() as { user: User | null };
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        if (user.role === 'counselor') {
          // Fetch users for counselors
          const response = await userAPI.getUsers();
          setUsers(response.data);
        } else {
          // Fetch counselors for users
          const response = await userAPI.getCounselors();
          setUsers(response.data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  useEffect(() => {
    const initializeChat = async () => {
      if (!selectedUser || !user) return;

      try {
        // Create or get existing chat
        const chatResponse = await chatAPI.create(selectedUser);
        const chatId = chatResponse.data._id;
        setCurrentChatId(chatId);

        // Fetch messages
        const messagesResponse = await chatAPI.getMessages(chatId);
        setMessages(messagesResponse.data.map((msg: any) => ({
          id: msg._id,
          sender: msg.sender._id === user._id ? 'You' : msg.sender.name,
          senderId: msg.sender._id,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        })));
      } catch (err) {
        console.error('Error initializing chat:', err);
        setError('Failed to initialize chat. Please try again later.');
      }
    };

    initializeChat();
  }, [selectedUser, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !user || !currentChatId) return;

    try {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'You',
        senderId: user._id,
        content: newMessage,
        timestamp: new Date(),
      };

      // Optimistically update UI
      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Send message to server using the correct chat ID
      await chatAPI.sendMessage(currentChatId, newMessage);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      // Revert optimistic update
      setMessages(prev => prev.slice(0, -1));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

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
            Chat Session
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

      <Grid container spacing={3}>
        {/* User List for Counselors and Regular Users */}
        {!selectedUser && (
          <Grid sx={{ gridColumn: 'span 12' }}>
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                minHeight: 'calc(100vh - 200px)'
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
                {user?.role === 'counselor' ? 'Select a User to Chat' : 'Select a Counselor to Chat'}
              </Typography>
              {users.length === 0 ? (
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                    color: '#666'
                  }}
                >
                  <ChatIcon sx={{ fontSize: 48, mb: 2, color: '#2196f3' }} />
                  <Typography variant="body1">
                    {user?.role === 'counselor' 
                      ? 'No users available to chat with.' 
                      : 'No counselors available to chat with.'}
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {users.map((user) => (
                    <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }} key={user._id}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          borderRadius: 2,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          '&:hover': {
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                          }
                        }}
                        onClick={() => setSelectedUser(user._id)}
                      >
                        <CardContent>
                          <Box 
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2
                            }}
                          >
                            <Avatar 
                              sx={{ 
                                width: 48, 
                                height: 48,
                                mr: 2,
                                backgroundColor: '#2196f3'
                              }}
                            >
                              {user.name[0]}
                            </Avatar>
                            <Box>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  color: '#2c3e50',
                                  fontWeight: 600
                                }}
                              >
                                {user.name}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                              >
                                {user.email}
                              </Typography>
                              {user.role === 'counselor' && user.specialization && (
                                <Chip
                                  label={user.specialization}
                                  size="small"
                                  sx={{
                                    mt: 1,
                                    backgroundColor: '#e3f2fd',
                                    color: '#1976d2'
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<ChatIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user._id);
                            }}
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
                            Start Chat
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>
        )}

        {/* Chat Interface */}
        {selectedUser && (
          <>
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: 'calc(100vh - 200px)',
                  minHeight: '600px',
                  maxHeight: '800px',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Chat Messages */}
                <Box 
                  sx={{ 
                    flexGrow: 1, 
                    overflow: 'auto', 
                    mb: 2,
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                    minHeight: '400px',
                    maxHeight: 'calc(100vh - 400px)'
                  }}
                >
                  {messages.length === 0 ? (
                    <Box 
                      sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#666'
                      }}
                    >
                      <ChatIcon sx={{ fontSize: 48, mb: 2, color: '#2196f3' }} />
                      <Typography variant="body1">
                        No messages yet. Start the conversation!
                      </Typography>
                    </Box>
                  ) : (
                    messages.map((message, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: message.senderId === user?._id ? 'flex-end' : 'flex-start',
                          mb: 2
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: '70%',
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: message.senderId === user?._id ? '#2196f3' : '#f5f5f5',
                            color: message.senderId === user?._id ? 'white' : '#2c3e50',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: '50%',
                              [message.senderId === user?._id ? 'right' : 'left']: -8,
                              transform: 'translateY(-50%)',
                              borderTop: '8px solid transparent',
                              borderBottom: '8px solid transparent',
                              [message.senderId === user?._id ? 'borderLeft' : 'borderRight']: `8px solid ${
                                message.senderId === user?._id ? '#2196f3' : '#f5f5f5'
                              }`
                            }
                          }}
                        >
                          <Typography variant="body1">{message.content}</Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block',
                              mt: 1,
                              opacity: 0.7,
                              fontSize: '0.75rem'
                            }}
                          >
                            {message.sender} • {new Date(message.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Box 
                  component="form" 
                  onSubmit={handleSendMessage}
                  sx={{ 
                    display: 'flex',
                    gap: 2,
                    p: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    mt: 'auto'
                  }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    multiline
                    maxRows={4}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#2196f3',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196f3',
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!newMessage.trim()}
                    sx={{
                      px: 3,
                      borderRadius: 2,
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                      },
                      '&:disabled': {
                        background: '#e0e0e0',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    Send
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* User Info */}
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column',
                  height: 'calc(100vh - 200px)',
                  minHeight: '600px',
                  maxHeight: '800px',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#2c3e50',
                      fontWeight: 600
                    }}
                  >
                    User Information
                  </Typography>
                  <IconButton 
                    onClick={() => setSelectedUser('')}
                    sx={{ 
                      color: '#666',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                {selectedUser && (
                  <Box>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        p: 2,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 64, 
                          height: 64,
                          mr: 2,
                          backgroundColor: '#2196f3'
                        }}
                      >
                        {users.find(u => u._id === selectedUser)?.name[0]}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#2c3e50',
                            fontWeight: 600
                          }}
                        >
                          {users.find(u => u._id === selectedUser)?.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          {users.find(u => u._id === selectedUser)?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default Chat; 