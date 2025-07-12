import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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
  // In real app, fetch question/answers by id
  const question = mockQuestion; // would filter by id
  const [answers, setAnswers] = useState(mockAnswers);
  const [commentInputs, setCommentInputs] = useState<{ [answerId: string]: string }>({});

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
              <input
                type="text"
                className="comment-input"
                placeholder="Add a comment..."
                value={commentInputs[ans.id] || ''}
                onChange={e => handleCommentChange(ans.id, e.target.value)}
              />
              <button
                className="add-comment-btn"
                onClick={() => handleAddComment(ans.id)}
                disabled={!(commentInputs[ans.id] && commentInputs[ans.id].trim())}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}

      <h3>Write your answer</h3>
      <textarea className="answer-textarea" placeholder="Write your answer here..." disabled />

      <button className="submit-btn" disabled>Login to answer</button>
    </div>
  );
};

export default QuestionDetails;
