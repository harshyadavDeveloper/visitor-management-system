import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Typography, 
  Container, 
  Button,
  Box,
  Alert,
  Snackbar
} from '@mui/material';

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      if (response.status === 200) {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role.toString());
        
        navigate(response.data.role ? '/admin' : '/reception');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="login-container">
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Employee Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box className="form-group">
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Box>

          <Box className="form-group">
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default EmployeeLogin;