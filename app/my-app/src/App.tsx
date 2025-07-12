import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import { authUtils } from './services/api';
import './App.css';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/feed" element={<Home />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/signup" element={<SignupWrapper />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardWrapper /></ProtectedRoute>} />
        <Route path="*" element={<NavigateToDefault />} />
      </Routes>
    </Router>
  );
}

// Redirect to dashboard if logged in, else to login
function NavigateToDefault() {
  const isLoggedIn = authUtils.isLoggedIn();
  return <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />;
}

// Protect dashboard route
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = authUtils.isLoggedIn();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Wrappers to handle navigation after login/signup/logout
function LoginWrapper() {
  const navigate = useNavigate();
  return <Login onLoginSuccess={() => navigate('/dashboard')} onSwitchToSignup={() => navigate('/signup')} />;
}

function SignupWrapper() {
  const navigate = useNavigate();
  return <Signup onSignupSuccess={() => navigate('/dashboard')} onSwitchToLogin={() => navigate('/login')} />;
}

function DashboardWrapper() {
  const navigate = useNavigate();
  return <Dashboard onLogout={() => {
    authUtils.removeToken();
    navigate('/login');
  }} />;
}

export default App;