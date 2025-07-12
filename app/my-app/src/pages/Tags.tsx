import React from 'react';
import './Tags.css';
import { Link } from 'react-router-dom';

const mockTags = [
  { name: 'react', questionCount: 24 },
  { name: 'typescript', questionCount: 16 },
  { name: 'jwt', questionCount: 10 },
  { name: 'hooks', questionCount: 12 },
  { name: 'auth', questionCount: 7 },
];

const Tags: React.FC = () => {
  return (
    <div className="tags-container">
      <h1>Browse Tags</h1>
      <div className="tags-grid">
        {mockTags.map((tag) => (
          <Link to={`/tags/${tag.name}`} key={tag.name} className="tag-card">
            <div className="tag-name">#{tag.name}</div>
            <div className="tag-count">{tag.questionCount} questions</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tags;
