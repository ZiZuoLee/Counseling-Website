import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Add types for users and counselors
interface UserType {
  id: number;
  name: string;
  email: string;
  role: string;
}
interface CounselorType {
  id: number;
  name: string;
  email: string;
  specialization: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [counselors, setCounselors] = useState<CounselorType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });

  useEffect(() => {
    // TODO: Fetch users and counselors from backend
    // Mock data for now
    setUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    ]);
    setCounselors([
      { id: 1, name: 'Dr. Smith', email: 'smith@example.com', specialization: 'Anxiety & Depression' },
      { id: 2, name: 'Dr. Johnson', email: 'johnson@example.com', specialization: 'Family Counseling' },
    ]);
  }, []);

  const handleAddUser = () => {
    setFormData({ name: '', email: '', role: 'user' });
    setOpenDialog(true);
  };

  const handleEditUser = (user: any) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleDialogSubmit = () => {
    // TODO: Implement user creation/update logic
    console.log('Submitting user data:', formData);
    handleDialogClose();
  };

  const handleDeleteUser = (userId: number) => {
    // TODO: Implement user deletion logic
    console.log('Deleting user:', userId);
  };

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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <img src={require('../logo/Anahata White.png')} alt="Counseling Logo" style={{ width: 80, marginRight: 16, borderRadius: 8 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}>
          Admin Dashboard
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h3">{users.length}</Typography>
          </Paper>
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Total Counselors
            </Typography>
            <Typography variant="h3">{counselors.length}</Typography>
          </Paper>
        </Grid>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Active Sessions
            </Typography>
            <Typography variant="h3">3</Typography>
          </Paper>
        </Grid>

        {/* User Management */}
        <Grid sx={{ gridColumn: 'span 12' }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">User Management</Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddUser}>
                Add User
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => handleEditUser(user)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteUser(user.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Counselor Management */}
        <Grid sx={{ gridColumn: 'span 12' }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Counselor Management
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Specialization</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {counselors.map((counselor) => (
                    <TableRow key={counselor.id}>
                      <TableCell>{counselor.name}</TableCell>
                      <TableCell>{counselor.email}</TableCell>
                      <TableCell>{counselor.specialization}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => handleEditUser(counselor)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteUser(counselor.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              label="Role"
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="counselor">Counselor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogSubmit} variant="contained">
            {selectedUser ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 