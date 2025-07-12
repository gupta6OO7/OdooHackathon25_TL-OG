import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from './RichTextEditor';
import './AskQuestion.css';
import { authUtils } from '../services/api';

const tags = ['react', 'typescript', 'jwt', 'hooks', 'auth'];

const AskQuestion: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navigate = useNavigate();

  const user = authUtils.getUser();
  const isLoggedIn = authUtils.isLoggedIn();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn || !user?.id) {
      navigate('/login');
      return;
    }

    try {
      const payload = {
        title,
        description,
        tags: selectedTags,
        userId: user.id,
      };

      const res = await fetch('http://localhost:3001/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // if you implement JWT
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to submit question');
      }

      alert('Question submitted successfully!');
      navigate('/');
    } catch (err: any) {
      alert(err.message || 'Error submitting question');
    }
  };

  return (
    <div className="ask-container">
      <div
        className="ask-back"
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: 24 }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M15.5 19L8.5 12L15.5 5" stroke="#667eea" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span style={{ marginLeft: 8, color: '#e2e8f0', fontWeight: 600 }}>Home</span>
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
