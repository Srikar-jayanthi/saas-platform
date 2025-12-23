import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h1>SaaS Project Pro</h1>
        <nav style={{ flex: 1 }}>
          <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'nav-active' : ''}`}>
            📊 Dashboard
          </Link>
          <Link to="/projects" className="nav-item">📂 Projects</Link>
          {user?.role === 'tenant_admin' && (
            <Link to="/users" className="nav-item">👥 Team Members</Link>
          )}
        </nav>
        <button onClick={handleLogout} style={{ background: '#dc2626', marginTop: 'auto' }}>
          Logout
        </button>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;