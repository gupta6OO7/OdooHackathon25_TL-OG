import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RichTextEditor from './RichTextEditor';
import { authUtils, answersAPI } from '../services/api';
import api from '../services/api';
import './QuestionDetails.css';

interface Answer {
  id: string;
  content: string;
  author: string;
  userId?: string;
  createdAt: string;
  voteCount: number;
  isAccepted: boolean;
  comments: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }>;
  votes?: number;
  description?: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  userId?: string;
  createdAt: string;
  answers: Answer[];
}



const QuestionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [answerId: string]: string }>({});
  const [answerContent, setAnswerContent] = useState('');
  const isLoggedIn = authUtils.isLoggedIn();
  // Cache for userId to userName
  const [userNames, setUserNames] = useState<{ [userId: string]: string }>({});

  // Helper to fetch userName by userId and cache it
  const fetchUserName = async (userId: string) => {
    if (!userId) return '';
    if (userNames[userId]) return userNames[userId];
    try {
      const res = await api.get(`/users/${userId}`);
      const userName = res.data?.userName || 'Unknown';
      setUserNames(prev => ({ ...prev, [userId]: userName }));
      return userName;
    } catch {
      setUserNames(prev => ({ ...prev, [userId]: 'Unknown' }));
      return 'Unknown';
    }
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/questions/${id}`);
        const q = res.data;
        // Fetch userName for question author
        if (q.userId) fetchUserName(q.userId);
        // Fetch userNames for all answer authors
        if (Array.isArray(q.answers)) {
          q.answers.forEach((ans: any) => {
            if (ans.userId) fetchUserName(ans.userId);
          });
        }
        setQuestion(q);
      } catch (err: any) {
        setError('Failed to load question.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCommentChange = (answerId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [answerId]: value }));
  };

  // Placeholder for add comment logic
  const handleAddComment = (answerId: string) => {
    // TODO: Integrate comment API
    setCommentInputs((prev) => ({ ...prev, [answerId]: '' }));
  };

  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');

  if (loading) return <div className="question-details-container"><p>Loading...</p></div>;
  if (error || !question) return <div className="question-details-container"><p>{error || 'Question not found.'}</p></div>;

  return (
    <div className="question-details-container dark">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <span className="breadcrumb-link" onClick={() => navigate('/')}>Home</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Question</span>
      </div>

      <h1 className="question-title">{question.title}</h1>
      <div className="question-meta">
        Posted by {question.userId ? (userNames[question.userId] || '...') : 'Unknown'}
      </div>
      <div className="question-description" dangerouslySetInnerHTML={{ __html: question.description }} />

      <div className="question-tags">
        {question.tags.map((tag) => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>
      <h2 className="answer-section-title">Answers</h2>
      {(question.answers || []).length === 0 && <div className="no-answers">No answers yet.</div>}
      {(question.answers || []).map((ans) => (
        <div key={ans.id} className={`answer-card ${ans.isAccepted ? 'accepted' : ''}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          {/* Votes on the left */}
          <div style={{ minWidth: 48, textAlign: 'center', color: '#a0aec0', fontWeight: 600, fontSize: '1.1rem', marginRight: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#f87171',
                fontSize: '1.5rem',
                lineHeight: 1,
                padding: 0,
                marginBottom: 2,
                transition: 'color 0.2s',
              }}
              title="Upvote"
              onClick={async () => {
                if (!isLoggedIn) return;
                try {
                  await answersAPI.voteAnswer({
                    answerId: ans.id,
                    title: (ans as any)?.title || '',
                    description: ans?.description || ans?.content || '',
                    userId: authUtils.getUser()?.id || '',
                    vote: 1
                  });
                  // Update local state for votes
                  setQuestion(prevQ => {
                    if (!prevQ) return prevQ;
                    const updatedAnswers = prevQ.answers.map(a =>
                      a.id === ans.id
                        ? { ...a, votes: (typeof a.votes === 'number' ? a.votes : (a.voteCount ?? 0)) + 1, voteCount: (typeof a.votes === 'number' ? a.votes : (a.voteCount ?? 0)) + 1 }
                        : a
                    );
                    return { ...prevQ, answers: updatedAnswers };
                  });
                } catch {}
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 5 5 19 19 19" /></svg>
            </button>
            <div style={{ fontSize: '1.5rem', color: '#f093fb', fontWeight: 700 }}>{typeof ans.votes === 'number' ? ans.votes : (ans.voteCount ?? 0)}</div>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#60a5fa',
                fontSize: '1.5rem',
                lineHeight: 1,
                padding: 0,
                marginTop: 2,
                transition: 'color 0.2s',
              }}
              title="Downvote"
              onClick={async () => {
                if (!isLoggedIn) return;
                try {
                  await answersAPI.voteAnswer({
                    answerId: ans.id,
                    title: (ans as any)?.title || '',
                    description: ans?.description || ans?.content || '',
                    userId: authUtils.getUser()?.id || '',
                    vote: -1
                  });
                  // Update local state for votes
                  setQuestion(prevQ => {
                    if (!prevQ) return prevQ;
                    const updatedAnswers = prevQ.answers.map(a =>
                      a.id === ans.id
                        ? { ...a, votes: (typeof a.votes === 'number' ? a.votes : (a.voteCount ?? 0)) - 1, voteCount: (typeof a.votes === 'number' ? a.votes : (a.voteCount ?? 0)) - 1 }
                        : a
                    );
                    return { ...prevQ, answers: updatedAnswers };
                  });
                } catch {}
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 19 5 5 19 5" /></svg>
            </button>
            <div style={{ fontSize: '0.95rem', color: '#a0aec0' }}>votes</div>
          </div>
          {/* Answer content and comments */}
          <div style={{ flex: 1 }}>
            <div className="answer-content" dangerouslySetInnerHTML={{ __html: ans.description || ans.content }} />
            <div className="answer-meta">
              {ans.isAccepted && <strong>✔ Accepted • </strong>}
              Answered by {ans.userId ? (userNames[ans.userId] || '...') : 'Unknown'}
            </div>
            {/* Comments Section */}
            <div className="answer-comments" style={{ marginTop: 10 }}>
              <div className="comments-list" style={{ fontSize: '0.97rem', opacity: 0.92 }}>
                {(ans.comments || []).map((c) => (
                  <div key={c.id} className="comment-item">
                    <span className="comment-author">{c.author}:</span> {c.content}
                  </div>
                ))}
              </div>
              <div className="add-comment-row" style={{ marginTop: 6, width: '100%' }}>
                <div style={{ width: '100%' }}>
                  <RichTextEditor
                    placeholder="Add a comment..."
                    value={commentInputs[ans?.id] || ''}
                    onChange={(value) => handleCommentChange(ans?.id, value)}
                    className="compact"
                  />
                </div>
                <button
                  className="add-comment-btn"
                  onClick={() => handleAddComment(ans.id)}
                  disabled={!(commentInputs[ans.id] && commentInputs[ans.id].trim())}
                  style={{ marginTop: '8px', alignSelf: 'flex-start' }}
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <h3>Write your answer</h3>
      <RichTextEditor
        placeholder="Write a detailed answer to help the community..."
        value={answerContent}
        onChange={setAnswerContent}
        disabled={!isLoggedIn || posting}
      />
      {postError && <div style={{ color: '#f87171', marginTop: 8 }}>{postError}</div>}
      {!isLoggedIn && (
        <button className="submit-btn" disabled style={{ marginTop: '12px' }}>
          Login to answer
        </button>
      )}
      {isLoggedIn && (
        <button
          className="submit-btn"
          style={{ marginTop: '12px' }}
          disabled={posting || !answerContent.trim()}
          onClick={async () => {
            setPosting(true);
            setPostError('');
            try {
              await answersAPI.postAnswer({
                description: answerContent,
                questionId: question.id,
                title: ""
              });
              setAnswerContent('');
              // Refresh question/answers
              const res = await api.get(`/questions/${question.id}`);
              setQuestion(res.data);
            } catch (err: any) {
              setPostError('Failed to post answer.');
            } finally {
              setPosting(false);
            }
          }}
        >
          {posting ? 'Posting...' : 'Post Answer'}
        </button>
      )}
    </div>
  );
};

export default QuestionDetails;
