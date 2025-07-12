import React, { useState } from 'react';
import { authUtils } from '../services/api';
import './Home.css';

interface HomeProps {
  onLoginClick: () => void;
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ onLoginClick, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isLoggedIn = authUtils.isLoggedIn();
  const user = authUtils.getUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  const handleProtectedAction = (actionName: string) => {
    if (!isLoggedIn) {
      alert(`Please login to ${actionName}`);
      onLoginClick();
      return;
    }
    // Proceed with the action
    console.log(`Performing ${actionName}`);
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo">
            <h1>Stack Overflow Clone</h1>
          </div>
          
          <nav className="nav-links">
            <a href="#" onClick={() => handleProtectedAction('ask question')}>Ask Question</a>
            <a href="#" onClick={() => handleProtectedAction('view my profile')}>Profile</a>
          </nav>

          <div className="auth-section">
            {isLoggedIn ? (
              <div className="user-menu">
                <span className="welcome-text">Welcome, {user?.name}!</span>
                <button onClick={onLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <button onClick={onLoginClick} className="login-btn">Login</button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main">
        <div className="search-section">
          <h2>Find answers to your questions</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for questions, topics, or users..."
              className="search-input"
            />
            <button type="submit" className="search-btn">Search</button>
          </form>
        </div>

        {/* Questions Section */}
        <section className="questions-section">
          <div className="section-header">
            <h3>Recent Questions</h3>
            <button 
              onClick={() => handleProtectedAction('ask a new question')}
              className="ask-question-btn"
            >
              Ask Question
            </button>
          </div>

          <div className="questions-list">
            {/* Sample questions - replace with real data */}
            <div className="question-card">
              <div className="question-stats">
                <div className="stat">
                  <span className="count">5</span>
                  <span className="label">votes</span>
                </div>
                <div className="stat">
                  <span className="count">3</span>
                  <span className="label">answers</span>
                </div>
              </div>
              <div className="question-content">
                <h4>How to handle authentication in React applications?</h4>
                <p>I'm working on a React app and need to implement user authentication...</p>
                <div className="question-tags">
                  <span className="tag">react</span>
                  <span className="tag">authentication</span>
                  <span className="tag">javascript</span>
                </div>
                <div className="question-meta">
                  <span>asked 2 hours ago by John Doe</span>
                </div>
              </div>
            </div>

            <div className="question-card">
              <div className="question-stats">
                <div className="stat">
                  <span className="count">12</span>
                  <span className="label">votes</span>
                </div>
                <div className="stat">
                  <span className="count">8</span>
                  <span className="label">answers</span>
                </div>
              </div>
              <div className="question-content">
                <h4>Best practices for Node.js API development</h4>
                <p>What are the current best practices for building RESTful APIs with Node.js...</p>
                <div className="question-tags">
                  <span className="tag">node.js</span>
                  <span className="tag">api</span>
                  <span className="tag">express</span>
                </div>
                <div className="question-meta">
                  <span>asked 5 hours ago by Jane Smith</span>
                </div>
              </div>
            </div>

            <div className="question-card">
              <div className="question-stats">
                <div className="stat">
                  <span className="count">8</span>
                  <span className="label">votes</span>
                </div>
                <div className="stat">
                  <span className="count">4</span>
                  <span className="label">answers</span>
                </div>
              </div>
              <div className="question-content">
                <h4>TypeScript vs JavaScript for large projects</h4>
                <p>I'm starting a large project and wondering whether to use TypeScript or stick with JavaScript...</p>
                <div className="question-tags">
                  <span className="tag">typescript</span>
                  <span className="tag">javascript</span>
                  <span className="tag">project-management</span>
                </div>
                <div className="question-meta">
                  <span>asked 1 day ago by Mike Johnson</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action for Non-logged in users */}
        {!isLoggedIn && (
          <section className="cta-section">
            <h3>Join our community!</h3>
            <p>Get answers to your questions, help others, and build your reputation.</p>
            <button onClick={onLoginClick} className="cta-login-btn">
              Sign Up or Login
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
