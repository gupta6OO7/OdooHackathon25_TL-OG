import React from 'react';
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
  },
  {
    id: 'a2',
    content: 'I recommend storing the JWT in an HTTP-only cookie...',
    author: 'carol',
    createdAt: '2025-07-12T11:30:00Z',
    voteCount: 3,
    isAccepted: false,
  },
];

const QuestionDetails: React.FC = () => {
  return (
    <div className="question-details-container">
      <h1 className="question-title">{mockQuestion.title}</h1>
      <div className="question-meta">
        Posted by {mockQuestion.author} • {new Date(mockQuestion.createdAt).toLocaleString()}
      </div>
      <div className="question-description">{mockQuestion.description}</div>

      <div className="question-tags">
        {mockQuestion.tags.map((tag) => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>

      <h2 className="answer-section-title">Answers</h2>
      {mockAnswers.map((ans) => (
        <div key={ans.id} className={`answer-card ${ans.isAccepted ? 'accepted' : ''}`}>
          <div className="answer-content">{ans.content}</div>
          <div className="answer-meta">
            {ans.isAccepted && <strong>✔ Accepted • </strong>}
            {ans.voteCount} votes • Answered by {ans.author} on {new Date(ans.createdAt).toLocaleString()}
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
