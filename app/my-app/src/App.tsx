import { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import { authUtils } from './services/api';
import './App.css';

type AuthView = 'login' | 'signup' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = () => {
      if (authUtils.isLoggedIn()) {
        setCurrentView('dashboard');
      }
      setIsInitializing(false);
    };

    checkAuthStatus();
  }, []);

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleSignupSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  const switchToSignup = () => {
    setCurrentView('signup');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  if (isInitializing) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="App">
      {currentView === 'login' && (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={switchToSignup}
        />
      )}
      
      {currentView === 'signup' && (
        <Signup 
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={switchToLogin}
        />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
