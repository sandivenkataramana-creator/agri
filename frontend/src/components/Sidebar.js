import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiFileText, 
  FiDollarSign, 
  FiTarget, 
  FiUserCheck,
  FiCalendar,
  FiSettings,
  FiClipboard,
  FiChevronLeft,
  FiChevronRight,
  FiUserPlus,
  FiBell,
  FiMail
} from 'react-icons/fi';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'staff';

  // Menu items based on role
  const getMainMenuItems = () => {
    const baseItems = [
      { path: '/', icon: <FiHome />, label: 'Dashboard' }
    ];

    if (role === 'admin') {
      return [
        ...baseItems,
        { path: '/hods', icon: <FiUsers />, label: 'HODs' },
        { path: '/schemes', icon: <FiFileText />, label: 'Schemes' },
        { path: '/staff', icon: <FiUserCheck />, label: 'Staff' },
        { path: '/budget', icon: <FiDollarSign />, label: 'Budget' },
      ];
    } else if (role === 'hod') {
      return [
        ...baseItems,
        { path: '/schemes', icon: <FiFileText />, label: 'My Schemes' },
        { path: '/staff', icon: <FiUserCheck />, label: 'My Staff' },
        { path: '/attendance', icon: <FiCalendar />, label: 'Attendance' },
      ];
    } else {
      return [
        ...baseItems,
        { path: '/attendance', icon: <FiCalendar />, label: 'My Attendance' },
      ];
    }
  };

  const getMonitoringItems = () => {
    if (role === 'admin') {
      return [
        { path: '/kpis', icon: <FiTarget />, label: 'KPIs' },
        { path: '/nodal-officers', icon: <FiClipboard />, label: 'Nodal Officers' },
        { path: '/attendance', icon: <FiCalendar />, label: 'Attendance' },
        { path: '/send-notification', icon: <FiBell />, label: 'Send Notification' },
        { path: '/send-message', icon: <FiMail />, label: 'Send Message' },
      ];
    }
    return [];
  };

  const mainMenuItems = getMainMenuItems();
  const monitoringItems = getMonitoringItems();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <>
            <h1>Navigation Menu</h1>
            <p>Quick Access</p>
          </>
        )}
        <button 
          className="sidebar-toggle" 
          onClick={onToggle}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
      <nav className="nav-menu">
        {!isCollapsed && <div className="nav-section">Main Menu</div>}
        {mainMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={isCollapsed ? item.label : ''}
          >
            {item.icon}
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
        
        {monitoringItems.length > 0 && (
          <>
            {!isCollapsed && <div className="nav-section">Monitoring</div>}
            {monitoringItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </>
        )}
        
        {!isCollapsed && <div className="nav-section">Settings</div>}
        {role === 'admin' && (
          <NavLink to="/register-user" className="nav-item" title={isCollapsed ? 'Register User' : ''}>
            <FiUserPlus />
            {!isCollapsed && <span>Register User</span>}
          </NavLink>
        )}
        <NavLink to="/settings" className="nav-item" title={isCollapsed ? 'Settings' : ''}>
          <FiSettings />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
