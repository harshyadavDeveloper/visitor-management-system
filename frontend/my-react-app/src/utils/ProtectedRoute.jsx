import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token; // Convert token to boolean

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return children;
}

export default ProtectedRoute