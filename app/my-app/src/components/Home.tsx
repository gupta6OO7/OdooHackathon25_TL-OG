import React, { useState } from 'react';
import Header from './Header';
import { authUtils } from '../services/api';
import { useNavigate } from 'react-router-dom';
import type { Question } from '../types/question';
import './Home.css';

const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'How does JWT authentication work in React?',
    tags: ['react', 'jwt', 'auth'],
    voteCount: 12,
    answerCount: 3,
    author: 'alice',
    createdAt: '2025-07-11T12:00:00Z',
  },
  {
    id: '2',
    title: 'Why is useEffect running twice in React 18?',
    tags: ['react', 'hooks'],
    voteCount: 27,
    answerCount: 6,
    author: 'bob',
    createdAt: '2025-07-10T09:30:00Z',
  },
  {
    id: '3',
    title: 'Best practices for TypeScript in large projects',
    tags: ['typescript', 'best-practices'],
    voteCount: 34,
    answerCount: 8,
    author: 'developer123',
    createdAt: '2025-07-09T15:20:00Z',
  },
  {
    id: '4',
    title: 'How to handle state management in React?',
    tags: ['react', 'state-management', 'redux'],
    voteCount: 18,
    answerCount: 5,
    author: 'reactdev',
    createdAt: '2025-07-08T10:45:00Z',
  },
];

// Login Modal Component
const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onLogin: () => void; onSignup: () => void }> = ({ 
  isOpen, 
  onClose, 
  onLogin, 
  onSignup 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔒 Login Required</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>You need to be logged in to perform this action.</p>
          <p>Join our community to ask questions, share knowledge, and help others!</p>
        </div>
        <div className="modal-actions">
          <button className="login-btn" onClick={onLogin}>
            Login
          </button>
          <button className="signup-btn" onClick={onSignup}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [filteredQuestions, setFilteredQuestions] = useState(mockQuestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = authUtils.isLoggedIn();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilteredQuestions(
      mockQuestions.filter((q) =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  };

  const handleProtectedAction = (path: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    navigate(path);
  };

  const handleModalLogin = () => {
    setShowLoginModal(false);
    navigate('/login');
  };

  const handleModalSignup = () => {
    setShowLoginModal(false);
    navigate('/signup');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <>
      <Header />
      <div className="home-container">
        {/* Hero Search Section */}
        <div className="search-section">
          <h1>Find Your Answers</h1>
          <p>Get help from our community of developers</p>
          <form onSubmit={handleSearch} className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for questions, topics, or technologies..."
              className="search-input"
            />
          </form>
        </div>

        <div className="main-content">
          {/* Questions Section */}
          <div className="questions-section">
            <div className="section-header">
              <h2>Recent Questions</h2>
              <button 
                onClick={() => handleProtectedAction('/ask')}
                className="ask-question-btn"
              >
                Ask Question
              </button>
            </div>

            <div className="questions-grid">
              {filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className="question-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/question/${question.id}`)}
                >
                  <h3 className="question-title">{question.title}</h3>
                  <div className="question-tags">
                    {question.tags.map((tag) => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                  <div className="question-meta">
                    <div className="question-stats">
                      <div className="stat">
                        <span className="stat-number">{question.voteCount}</span>
                        <span>votes</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">{question.answerCount}</span>
                        <span>answers</span>
                      </div>
                    </div>
                    <div className="question-author">
                      by {question.author} • {formatTimeAgo(question.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Welcome Banner for Non-logged Users */}
          {!isLoggedIn && (
            <div className="welcome-banner">
              <h3>Join Our Developer Community</h3>
              <p>Ask questions, share knowledge, and connect with thousands of developers worldwide.</p>
              <button 
                onClick={() => navigate('/signup')}
                className="cta-button"
              >
                Get Started Today
              </button>
            </div>
          )}
        </div>

        {/* Login Modal */}
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleModalLogin}
          onSignup={handleModalSignup}
        />
      </div>
    </>
  );
};

export default Home;
