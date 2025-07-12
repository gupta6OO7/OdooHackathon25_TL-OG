import React, { useState } from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import QuestionCard from './QuestionCard';
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
];

const Home: React.FC = () => {
  const [filteredQuestions, setFilteredQuestions] = useState(mockQuestions);

  const handleSearch = (query: string) => {
    setFilteredQuestions(
      mockQuestions.filter((q) =>
        q.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleTagSelect = (tag: string) => {
    setFilteredQuestions(mockQuestions.filter((q) => q.tags.includes(tag)));
  };

  return (
    <>
      <Header />
      <div className="home-container">
        <SearchBar onSearch={handleSearch} onTagSelect={handleTagSelect} />
        {filteredQuestions.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
    </>
  );
};

export default Home;
