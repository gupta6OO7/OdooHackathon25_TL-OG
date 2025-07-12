import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authUtils } from '../services/api';
import { RedirectService } from '../services/redirectService';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = authUtils.isLoggedIn();
  const user = authUtils.getUser();

  const handleProtectedAction = (path: string, action?: () => void) => {
    if (!isLoggedIn) {
      RedirectService.setRedirectPath(path);
      navigate('/login');
      return;
    }
    if (action) {
      action();
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    authUtils.removeToken();
    navigate('/');
    window.location.reload(); // Refresh to update auth state
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">StackIt</Link>
      </div>
      <div className="header-right">
        {isLoggedIn ? (
          <>
            <button 
              onClick={() => handleProtectedAction('/ask')}
              className="nav-button"
            >
              Ask Question
            </button>
            <button 
              onClick={() => handleProtectedAction('/notifications')}
              className="nav-button"
            >
              🔔
            </button>
            <button 
              onClick={() => handleProtectedAction('/profile')}
              className="nav-button"
            >
              {user?.name || 'Profile'}
            </button>
            <button onClick={handleLogout} className="nav-button logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/signup" className="nav-button">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
