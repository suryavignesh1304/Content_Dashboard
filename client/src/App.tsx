import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { RootState } from './store';
import { setToken } from './store/slices/authSlice';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import EmailVerification from './components/auth/EmailVerification';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      dispatch(setToken(storedToken));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: darkMode ? '#374151' : '#ffffff',
              color: darkMode ? '#ffffff' : '#000000',
              border: darkMode ? '1px solid #4B5563' : '1px solid #E5E7EB',
            },
            success: { iconTheme: { primary: '#10B981', secondary: '#ffffff' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#ffffff' } },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;