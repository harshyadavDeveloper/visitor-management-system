import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css'
import EmployeeLogin from './screens/EmployeeLogin'
import ReceptionDashboard from './screens/ReceptionDashboard'
import AdminDashboard from './screens/AdminDashboard';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import Page404 from './utils/Page404';

function App() {
  const theme = createTheme(); // You can customize the theme here

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/reception" element={
            <ProtectedRoute>
              <ReceptionDashboard />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<EmployeeLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
