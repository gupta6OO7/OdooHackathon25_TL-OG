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
  createdAt: string;
  voteCount: number;
  isAccepted: boolean;
  comments: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }>;
}

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
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

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/questions/answers?questionId=${id}`);
        setQuestion(res.data);
      } catch (err: any) {
        setError('Failed to load question.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
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
        Posted by {question.author} • {new Date(question.createdAt).toLocaleString()}
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
        <div key={ans.id} className={`answer-card ${ans.isAccepted ? 'accepted' : ''}`}>
          <div className="answer-content" dangerouslySetInnerHTML={{ __html: ans.content }} />
          <div className="answer-meta">
            {ans.isAccepted && <strong>✔ Accepted • </strong>}
            {ans.voteCount} votes • Answered by {ans.author} on {new Date(ans.createdAt).toLocaleString()}
          </div>
          {/* Comments Section */}
          <div className="answer-comments">
            <div className="comments-list">
              {(ans.comments || []).map((c) => (
                <div key={c.id} className="comment-item">
                  <span className="comment-author">{c.author}:</span> {c.content}
                  <span className="comment-time"> • {new Date(c.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="add-comment-row">
              <RichTextEditor
                placeholder="Add a comment..."
                value={commentInputs[ans.id] || ''}
                onChange={(value) => handleCommentChange(ans.id, value)}
                className="compact"
              />
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
              });
              setAnswerContent('');
              // Refresh question/answers
              const res = await api.get(`/questions/answers?questionId=${question.id}`);
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
