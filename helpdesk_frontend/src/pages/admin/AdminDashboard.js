import React, { useState, useEffect } from 'react';
import DashboardPage from './DashboardPage';
import LiveChatPage from './LiveChatPage';
import KnowledgeBasePage from './KnowledgeBasePage';
import PermissionDenied from './PermissionDenied';
import { fetchAllTickets } from '../../services/chat/ticketService';
import '../../style/admin/AdminDashboard.css';
import '../../style/auth/CreateAccount.css';
import CreateAccountFeature from '../../features/auth/CreateAccountFeature';

const ROLE_MAPPING = {
  admin: 'Admin',
  technical: 'Technical Admin',
  support: 'Customer Service',
  finance: 'Finance/Accounting',
};

const ROUTES = {
  DASHBOARD: 'dashboard',
  LIVE_CHAT: 'live-chat',
  KNOWLEDGE_BASE: 'knowledge-base',
  CREATE_ACCOUNT: 'create-account',
};

const PAGE_TITLES = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.LIVE_CHAT]: 'Tickets',
  [ROUTES.KNOWLEDGE_BASE]: 'KB Management',
  [ROUTES.CREATE_ACCOUNT]: 'Create Account',
};

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState(ROUTES.DASHBOARD);
  const [user, setUser] = useState(null);
  const [currentRole, setCurrentRole] = useState('');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoaded, setTicketsLoaded] = useState(false);
  const isMobile = window.innerWidth < 768;
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setCurrentRole(userData.role);
    }
  }, []);

  useEffect(() => {
    if (isMobile) setIsSidebarExpanded(false);
  }, [isMobile]);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const ticketData = await fetchAllTickets();
        setTickets(ticketData);
      } catch (err) {
        console.error('Error loading tickets:', err);
      } finally {
        setTicketsLoaded(true);
      }
    };

    loadTickets();
  }, []);

  const hasAccess = (page) => {
    switch (currentRole) {
      case 'admin':
        return true;
      case 'technical':
        // Technical admin has access to dashboard and live chat
       return page === ROUTES.LIVE_CHAT;
      case 'support':
        // Support only accesses live chat (tickets)
        return page === ROUTES.LIVE_CHAT;
      case 'finance':
        // Finance only accesses dashboard
        return page === ROUTES.LIVE_CHAT;
      default:
        return false;
    }
  };


  const PageComponent = () => {
    if (!hasAccess(currentPage)) return <PermissionDenied />;

    switch (currentPage) {
      case ROUTES.DASHBOARD: return <DashboardPage />;
      case ROUTES.LIVE_CHAT: return <LiveChatPage currentRole={currentRole} />;
      case ROUTES.KNOWLEDGE_BASE: return <KnowledgeBasePage />;
      case ROUTES.CREATE_ACCOUNT: return <CreateAccountFeature />;
      default: return <div>Page not found</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="head" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <h2 style={{margin: 0}}>{PAGE_TITLES[currentPage]}</h2>
        <div className="header-controls" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          {user && (
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span>Welcome, {user.name}</span>
              <span style={{fontWeight: 'bold'}}>({ROLE_MAPPING[user.role] || user.role})</span>
            </div>
          )}
          <button
            onClick={() => {
              localStorage.removeItem("isAuthenticated");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            style={{
              padding: '5px 10px',
              backgroundColor: '#4b62b0ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <div className="dashboard-layout">
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
                      onClick={() => allowed && setCurrentPage(route)}
                      className={`nav-button ${active ? 'active' : ''} ${!allowed ? 'disabled' : ''}`}
                    >
                      {PAGE_TITLES[route]}
                    </button>
                  </li>
                );
              })}


            </ul>
          </nav>

          <button className="sidebar-toggle" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
            ☰
          </button>
        </aside>
        <div className="main-content">
          <main className="content"><PageComponent /></main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
