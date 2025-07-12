import React, { useState, useRef, useEffect } from 'react';
import Notifications from './Notifications';
import { Link, useNavigate } from 'react-router-dom';
import { authUtils } from '../services/api';
import { RedirectService } from '../services/redirectService';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = authUtils.isLoggedIn();
  const user = authUtils.getUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLButtonElement>(null);
  const notifBoxRef = useRef<HTMLDivElement>(null);

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

  // Notification dropdown toggle
  const handleNotifClick = () => {
    setShowNotifications((prev) => !prev);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifBoxRef.current &&
        !notifBoxRef.current.contains(event.target as Node) &&
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

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
              ref={notifRef}
              onClick={handleNotifClick}
              className="nav-button notif-bell"
              style={{ position: 'relative' }}
              aria-label="Notifications"
            >
              🔔
              {/* Optionally add a red dot for unread */}
              <span className="notif-dot"></span>
            </button>
            {showNotifications && (
              <div ref={notifBoxRef} className="notif-dropdown">
                <Notifications />
              </div>
            )}
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
