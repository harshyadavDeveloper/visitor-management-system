import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EmployeeLogin from './screens/EmployeeLogin'
import ReceptionDashboard from './screens/ReceptionDashboard'
import AdminDashboard from './screens/AdminDashboard'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/reception" element={<ReceptionDashboard />} />
          <Route path="/login" element={<EmployeeLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>


    </>
  )
}

export default App
