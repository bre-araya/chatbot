import React, { useState, useEffect } from 'react';
import '../../style/admin/AdminDashboard.css';

const DashboardLayout = ({ currentPage, onNavigate, currentRole, onRoleChange, hasAccess, pageTitle, children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (isMobile) setIsSidebarExpanded(false);
  }, [isMobile]);

  const ROUTES = {
    DASHBOARD: 'dashboard',
    LIVE_CHAT: 'live-chat',
    KNOWLEDGE_BASE: 'knowledge-base',
    SETTINGS: 'settings',
  };

  const PAGE_TITLES = {
    [ROUTES.DASHBOARD]: 'Dashboard',
    [ROUTES.LIVE_CHAT]: 'Live Chat & Intervention',
    [ROUTES.KNOWLEDGE_BASE]: 'Knowledge Base Management',
    [ROUTES.SETTINGS]: 'Settings & Configuration',
  };

  const ROLES = {
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    SUPERVISOR: 'Supervisor',
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
        <h1 className="logo">{isSidebarExpanded ? 'Chatbot Admin' : 'C.A.'}</h1>
        <nav>
          <ul>
            {Object.values(ROUTES).map(route => {
              const active = currentPage === route;
              const allowed = hasAccess(route);

              return (
                <li key={route}>
                  <button
                    onClick={() => allowed && onNavigate(route)}
                    className={`nav-button ${active ? 'active' : ''} ${!allowed ? 'disabled' : ''}`}
                  >
                    {PAGE_TITLES[route]}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <button className="toggle-button" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
          ☰
        </button>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="head">
          <h2>{pageTitle}</h2>
          <div className="header-controls">
            <select value={currentRole} onChange={(e) => onRoleChange(e.target.value)}>
              {Object.values(ROLES).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <div className="user-avatar">A</div>
            <span className="user-name">Admin User</span>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;