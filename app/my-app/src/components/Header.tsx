import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const isLoggedIn = false; // 🔒 Replace with actual auth logic later

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">StackIt</Link>
      </div>
      <div className="header-right">
        {isLoggedIn ? (
          <>
            <Link to="/ask" className="nav-button">Ask Question</Link>
            <Link to="/notifications" className="nav-button">🔔</Link>
            <Link to="/user/me" className="nav-button">Profile</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/register" className="nav-button">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
