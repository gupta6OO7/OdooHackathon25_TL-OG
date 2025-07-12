import React, { useState } from 'react';
import './SearchBar.css';

interface Props {
  onSearch: (query: string) => void;
  onTagSelect: (tag: string) => void;
}

const tags = ['react', 'jwt', 'typescript', 'hooks', 'auth'];

const SearchBar: React.FC<Props> = ({ onSearch, onTagSelect }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search questions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="tag-filter">
        {tags.map((tag) => (
          <button key={tag} onClick={() => onTagSelect(tag)} className="tag-button">
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
