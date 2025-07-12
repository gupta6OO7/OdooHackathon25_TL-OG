import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from './RichTextEditor';
import './AskQuestion.css';

const tags = ['react', 'typescript', 'jwt', 'hooks', 'auth'];

const AskQuestion: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title,
      description,
      tags: selectedTags,
    });
    alert('Question submitted! (check console)');
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedTags([]);
  };

  return (
    <div className="ask-container">
      <div className="ask-back" onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: 24 }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 19L8.5 12L15.5 5" stroke="#667eea" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '1.1rem', marginLeft: 8 }}>Home</span>
      </div>
      <h1>Ask a Question</h1>
      <form onSubmit={handleSubmit} className="ask-form">
        <label>Title</label>
        <input
          type="text"
          placeholder="What's your question?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <RichTextEditor
          placeholder="Describe your question in detail. You can use formatting, code blocks, and lists..."
          value={description}
          onChange={setDescription}
        />

        <label>Select Tags</label>
        <div className="tag-picker">
          {tags.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => toggleTag(tag)}
              className={selectedTags.includes(tag) ? 'tag selected' : 'tag'}
            >
              #{tag}
            </button>
          ))}
        </div>

        <button type="submit" className="submit-btn">
          Post Question
        </button>
      </form>
    </div>
  );
};

export default AskQuestion;
