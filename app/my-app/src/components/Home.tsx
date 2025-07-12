import React, { useEffect, useState } from 'react';
import Header from './Header';
import { authUtils } from '../services/api';
import { useNavigate } from 'react-router-dom';
import type { Question } from '../types/question';
import './Home.css';

const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onLogin: () => void; onSignup: () => void }> = ({
  isOpen,
  onClose,
  onLogin,
  onSignup,
}) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔒 Login Required</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = authUtils.isLoggedIn();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/questions');
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();

        const mapped = data.map((q: any) => ({
          id: q.id,
          title: q.title,
          tags: q.tags,
          voteCount: q.voteCount ?? 0,
          answerCount: q.answers?.length ?? 0,
          author: q.user?.username || 'Anonymous',
          createdAt: q.createdAt,
        }));

        setQuestions(mapped);
        setFilteredQuestions(mapped);
      } catch (err: any) {
        console.error('Error loading questions:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilteredQuestions(
      questions.filter(
        (q) =>
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  };

  const handleProtectedAction = (path: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate(path);
    }
  };

  const handleModalLogin = () => {
    setShowLoginModal(false);
    navigate('/login');
  };

  const handleModalSignup = () => {
    setShowLoginModal(false);
    navigate('/signup');
  };

  // const formatTimeAgo = (dateString: string) => {
  //   const date = new Date(dateString);
  //   const now = new Date();
  //   const diffTime = Math.abs(now.getTime() - date.getTime());
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   if (diffDays === 1) return '1 day ago';
  //   if (diffDays < 7) return `${diffDays} days ago`;
  //   if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  //   return `${Math.ceil(diffDays / 30)} months ago`;
  // };

  if (loading) return <div className="home-container"><p>Loading questions...</p></div>;

  return (
    <>
      <Header />
      <div className="home-container">
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
          <div className="questions-section">
            <div className="section-header">
              <h2>Recent Questions</h2>
              <button onClick={() => handleProtectedAction('/ask')} className="ask-question-btn">
                Ask Question
              </button>
            </div>

            <div className="questions-grid">
              {filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className="question-card"
                  onClick={() => navigate(`/question/${question.id}`)}
                >
                  <h3 className="question-title">{question.title}</h3>
                  <div className="question-tags">
                    {question.tags.map((tag) => (
                      <span key={tag} className="tag">
                        #{tag}
                      </span>
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
                      by {question.author} • 2 hours ago
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isLoggedIn && (
            <div className="welcome-banner">
              <h3>Join Our Developer Community</h3>
              <p>Ask questions, share knowledge, and connect with developers worldwide.</p>
              <button onClick={() => navigate('/signup')} className="cta-button">
                Get Started Today
              </button>
            </div>
          )}
        </div>

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
