import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Stack,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const AdminDashboard = () => {
  const [visitorData, setVisitorData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    timeIn: '',
    timeOut: '',
    assignedEmployee: '',
    room: '',
    visitorType: 'walk-in'
  });

  // Fetch visitor data
  const fetchVisitorData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/visitor/getVisitors');
      setVisitorData(response.data);
      console.log('Visitor data fetched successfully:', response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error fetching visitor data',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchVisitorData();
  }, []);

  // Open Edit Modal & Set Selected Visitor
  const handleEditClick = (visitor) => {
    setSelectedVisitor(visitor);
    setFormData({
      name: visitor.name,
      email: visitor.email,
      phone: visitor.phone,
      timeIn: moment(visitor.timeIn).format('YYYY-MM-DDTHH:mm'),
      timeOut: visitor.timeOut ? moment(visitor.timeOut).format('YYYY-MM-DDTHH:mm') : '',
      assignedEmployee: visitor.assignedEmployee || '',
      room: visitor.room || '',
      visitorType: visitor.visitorType
    });
    setIsEditModalOpen(true);
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Visitor Update
  const handleUpdateVisitor = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:5000/api/visitor/updateVisitor/${selectedVisitor._id}`, formData);

      // Update visitor data in the table
      const updatedVisitors = visitorData.map(visitor =>
        visitor._id === selectedVisitor._id ? response.data.visitor : visitor
      );
      setVisitorData(updatedVisitors);

      setIsEditModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Visitor updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update visitor.',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2">Name</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Email</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Phone</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Visitor Type</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Time In</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Time Out</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Assigned Employee</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Room</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visitorData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body1">No visitor data available</Typography>
                </TableCell>
              </TableRow>
            ) : (
              visitorData.map((visitor, index) => (
                <TableRow key={index}>
                  <TableCell>{visitor.name}</TableCell>
                  <TableCell>{visitor.email}</TableCell>
                  <TableCell>{visitor.phone}</TableCell>
                  <TableCell>{visitor.visitorType}</TableCell>
                  <TableCell>{moment(visitor.timeIn).format('DD MMM YY, h:mm:ss a')}</TableCell>
                  <TableCell>
                    {visitor.timeOut ? moment(visitor.timeOut).format('DD MMM YY, h:mm:ss a') : '-'}
                  </TableCell>
                  <TableCell>{visitor.assignedEmployee}</TableCell>
                  <TableCell>{visitor.room}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(visitor)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Visitor Modal */}
      <Dialog 
        open={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Visitor</DialogTitle>
        <form onSubmit={handleUpdateVisitor}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleInputChange} required />
              <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
              <FormControl fullWidth>
                <InputLabel>Visitor Type</InputLabel>
                <Select name="visitorType" value={formData.visitorType} onChange={handleInputChange} label="Visitor Type">
                  <MenuItem value="walk-in">Walk-in Visitor</MenuItem>
                  <MenuItem value="meeting">Meeting Visitor</MenuItem>
                  <MenuItem value="attendee">Meeting Attendee</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth label="Time In" name="timeIn" type="datetime-local" value={formData.timeIn} onChange={handleInputChange} required InputLabelProps={{ shrink: true }} />
              <TextField fullWidth label="Time Out" name="timeOut" type="datetime-local" value={formData.timeOut} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
              <TextField fullWidth label="Assigned Employee" name="assignedEmployee" value={formData.assignedEmployee} onChange={handleInputChange} />
              <TextField fullWidth label="Room" name="room" value={formData.room} onChange={handleInputChange} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsEditModalOpen(false)} color="error">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Update Visitor</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
