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
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const ReceptionDashboard = () => {
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const [visitorData, setVisitorData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    timeIn: getCurrentDateTime(),
    timeOut: '',
    assignedEmployee: '',
    room: '',
    visitorType: 'walk-in'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/visitor/addVisitor', formData);
      setVisitorData([...visitorData, response.data.visitor]);
      setIsModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Visitor added successfully!',
        severity: 'success'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        timeIn: getCurrentDateTime(),
        timeOut: '',
        assignedEmployee: '',
        room: '',
        visitorType: 'walk-in'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to add visitor.',
        severity: 'error'
      });
    }
  };

  const fetchVisitorData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/visitor/getTodayVisitors');
      setVisitorData(response.data);
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

  useEffect(() => {
    if (isModalOpen) {
      setFormData(prev => ({
        ...prev,
        timeIn: getCurrentDateTime()
      }));
    }
  }, [isModalOpen]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Reception Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          size="medium"
          sx={{
            minWidth: 'auto',
            px: 2,
            py: 1,
            borderRadius: 1
          }}
        >
          Add Visitor
        </Button>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {visitorData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
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
                  <TableCell>{moment(visitor.timeIn).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                  <TableCell>
                    {visitor.timeOut ? moment(visitor.timeOut).format('MMMM Do YYYY, h:mm:ss a') : '-'}
                  </TableCell>
                  <TableCell>{visitor.assignedEmployee}</TableCell>
                  <TableCell>{visitor.room}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Visitor</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <FormControl fullWidth>
                <InputLabel>Visitor Type</InputLabel>
                <Select
                  name="visitorType"
                  value={formData.visitorType}
                  onChange={handleInputChange}
                  label="Visitor Type"
                >
                  <MenuItem value="walk-in">Walk-in Visitor</MenuItem>
                  <MenuItem value="meeting">Meeting Visitor</MenuItem>
                  <MenuItem value="attendee">Meeting Attendee</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Time In"
                name="timeIn"
                type="datetime-local"
                value={formData.timeIn}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Time Out"
                name="timeOut"
                type="datetime-local"
                value={formData.timeOut}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />

              {(formData.visitorType === 'meeting' || formData.visitorType === 'attendee') && (
                <>
                  <TextField
                    fullWidth
                    label="Assigned Employee"
                    name="assignedEmployee"
                    value={formData.assignedEmployee}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Room"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    required
                  />
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsModalOpen(false)} color="error">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Add Visitor
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReceptionDashboard;