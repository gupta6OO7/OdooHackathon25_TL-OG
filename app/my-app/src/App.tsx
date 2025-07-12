import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Home from './pages/Home';
import { authUtils } from './services/api';
import { RedirectService } from './services/redirectService';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeWrapper />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/signup" element={<SignupWrapper />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardWrapper /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Home wrapper - no props needed since Header handles auth
function HomeWrapper() {
  return <Home />;
}

// Protect routes that require authentication
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = authUtils.isLoggedIn();
  
  if (!isLoggedIn) {
    // Save the current path for redirect after login
    RedirectService.setRedirectPath(window.location.pathname);
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Wrappers to handle navigation after login/signup/logout
function LoginWrapper() {
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    const redirectPath = RedirectService.getPostLoginRedirect();
    navigate(redirectPath);
  };
  
  return <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => navigate('/signup')} />;
}

function SignupWrapper() {
  const navigate = useNavigate();
  
  const handleSignupSuccess = () => {
    const redirectPath = RedirectService.getPostLoginRedirect();
    navigate(redirectPath);
  };
  
  return <Signup onSignupSuccess={handleSignupSuccess} onSwitchToLogin={() => navigate('/login')} />;
}

function DashboardWrapper() {
  const navigate = useNavigate();
  return <Dashboard onLogout={() => {
    authUtils.removeToken();
    navigate('/');
  }} />;
}

export default App;