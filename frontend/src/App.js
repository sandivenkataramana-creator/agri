import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterUser from './pages/RegisterUser';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import Dashboard from './pages/Dashboard';
import DashboardHOD from './pages/DashboardHOD';
import DashboardStaff from './pages/DashboardStaff';
import HODs from './pages/HODs';
import Schemes from './pages/Schemes';
import Staff from './pages/Staff';
import Budget from './pages/Budget';
import KPIs from './pages/KPIs';
import NodalOfficers from './pages/NodalOfficers';
import Attendance from './pages/Attendance';
import Settings from './pages/Settings';
import SendNotification from './pages/SendNotification';
import SendMessage from './pages/SendMessage';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {!user ? (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        ) : (
          <Route path="*" element={
            <div className={`app-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
              <TopHeader user={user} onLogout={handleLogout} />
              <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
              <main className="main-content">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      user.role === 'admin' ? <Dashboard /> :
                      user.role === 'hod' ? <DashboardHOD /> :
                      <DashboardStaff />
                    } 
                  />
                  <Route path="/change-password" element={<ChangePassword />} />
                  {user.role === 'admin' && (
                    <>
                      <Route path="/register-user" element={<RegisterUser />} />
                      <Route path="/hods" element={<HODs />} />
                      <Route path="/schemes" element={<Schemes />} />
                      <Route path="/staff" element={<Staff />} />
                      <Route path="/budget" element={<Budget />} />
                      <Route path="/kpis" element={<KPIs />} />
                      <Route path="/nodal-officers" element={<NodalOfficers />} />
                      <Route path="/attendance" element={<Attendance />} />
                      <Route path="/send-notification" element={<SendNotification />} />
                      <Route path="/send-message" element={<SendMessage />} />
                    </>
                  )}
                  {(user.role === 'admin' || user.role === 'hod') && (
                    <Route path="/attendance" element={<Attendance />} />
                  )}
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          } />
        )}
      </Routes>
    </Router>
  );
}

export default App;
