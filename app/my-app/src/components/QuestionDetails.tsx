import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RichTextEditor from './RichTextEditor';
import './QuestionDetails.css';

const mockQuestion = {
  id: '1',
  title: 'How does JWT authentication work in React?',
  description: `JWT (JSON Web Tokens) is a way to securely transmit information between parties as a JSON object...`,
  tags: ['react', 'jwt', 'auth'],
  author: 'alice',
  createdAt: '2025-07-11T12:00:00Z',
};

const mockAnswers = [
  {
    id: 'a1',
    content: 'You can use `localStorage` to store the token after login...',
    author: 'bob',
    createdAt: '2025-07-12T10:00:00Z',
    voteCount: 5,
    isAccepted: true,
    comments: [
      { id: 'c1', author: 'alice', content: 'Great answer!', createdAt: '2025-07-12T12:00:00Z' },
      { id: 'c2', author: 'carol', content: 'Can you elaborate on security?', createdAt: '2025-07-12T12:10:00Z' },
    ],
  },
  {
    id: 'a2',
    content: 'I recommend storing the JWT in an HTTP-only cookie...',
    author: 'carol',
    createdAt: '2025-07-12T11:30:00Z',
    voteCount: 3,
    isAccepted: false,
    comments: [
      { id: 'c3', author: 'bob', content: 'This is more secure!', createdAt: '2025-07-12T12:20:00Z' },
    ],
  },
];


const QuestionDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // In real app, fetch question/answers by id
  const question = mockQuestion; // would filter by id
  const [answers, setAnswers] = useState(mockAnswers);
  const [commentInputs, setCommentInputs] = useState<{ [answerId: string]: string }>({});
  const [answerContent, setAnswerContent] = useState('');

  const handleCommentChange = (answerId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [answerId]: value }));
  };

  const handleAddComment = (answerId: string) => {
    const text = commentInputs[answerId]?.trim();
    if (!text) return;
    setAnswers((prev) => prev.map(ans =>
      ans.id === answerId
        ? {
            ...ans,
            comments: [
              ...(ans.comments || []),
              {
                id: 'c' + Math.random().toString(36).slice(2),
                author: 'You',
                content: text,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : ans
    ));
    setCommentInputs((prev) => ({ ...prev, [answerId]: '' }));
  };

  return (
    <div className="question-details-container">
      <div className="question-back" onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: 24 }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 19L8.5 12L15.5 5" stroke="#667eea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '1.1rem', marginLeft: 8 }}>Home</span>
      </div>
      <h1 className="question-title">{question.title}</h1>
      <div className="question-meta">
        Posted by {question.author} • {new Date(question.createdAt).toLocaleString()}
      </div>
      <div className="question-description">{question.description}</div>

      <div className="question-tags">
        {question.tags.map((tag) => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>

      <h2 className="answer-section-title">Answers</h2>
      {answers.map((ans) => (
        <div key={ans.id} className={`answer-card ${ans.isAccepted ? 'accepted' : ''}`}>
          <div className="answer-content">{ans.content}</div>
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
        disabled={true}
      />

      <button className="submit-btn" disabled style={{ marginTop: '12px' }}>
        Login to answer
      </button>
    </div>
  );
};

export default QuestionDetails;
