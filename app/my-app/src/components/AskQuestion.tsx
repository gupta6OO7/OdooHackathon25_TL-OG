import React, { useState } from 'react';
import './AskQuestion.css';

const tags = ['react', 'typescript', 'jwt', 'hooks', 'auth'];

const AskQuestion: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
        <textarea
          placeholder="Describe your question in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          required
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
