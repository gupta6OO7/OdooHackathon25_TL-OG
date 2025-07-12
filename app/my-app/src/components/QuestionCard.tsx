import React from 'react';
import type { Question } from '../types/question';
import { Link } from 'react-router-dom';
import './QuestionCard.css'; // 👈 Add this

interface Props {
  question: Question;
}

const QuestionCard: React.FC<Props> = ({ question }) => {
  return (
    <div className="question-card">
      <div className="vote-section">
        <button>▲</button>
        <span>{question.voteCount}</span>
        <button>▼</button>
      </div>
      <div className="question-content">
        <Link to={`/question/${question.id}`} className="question-title">
          {question.title}
        </Link>
        <div className="question-meta">
          Posted by {question.author} • {new Date(question.createdAt).toLocaleDateString()}
        </div>
        <div className="question-tags">
          {question.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
        <div className="question-answers">{question.answerCount} answers</div>
      </div>
    </div>
  );
};

export default QuestionCard;
