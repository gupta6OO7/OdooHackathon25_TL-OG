import React, { useState, useEffect } from 'react';
import { authUtils, authAPI } from '../services/api';
import type { User } from '../services/api';
import './Profile.css';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    userName: '',
    email: ''
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      // First try to get user from localStorage
      const localUser = authUtils.getUser();
      if (localUser) {
        setUser(localUser);
        setEditForm({
          name: localUser.name,
          userName: localUser.userName,
          email: localUser.email
        });
      }

      // Then fetch fresh data from API
      const response = await authAPI.getProfile();
      if (response.success && response.data) {
        setUser(response.data.user);
        authUtils.saveUser(response.data.user); // Update localStorage
        setEditForm({
          name: response.data.user.name,
          userName: response.data.user.userName,
          email: response.data.user.email
        });
      }
    } catch (error: any) {
      console.error('Profile load error:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Here you would call an update profile API
      // For now, just update localStorage
      if (user) {
        const updatedUser = { ...user, ...editForm };
        setUser(updatedUser);
        authUtils.saveUser(updatedUser);
        setEditing(false);
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error-message">User not found</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {!editing ? (
            <div className="profile-info">
              <div className="info-row">
                <label>Name:</label>
                <span>{user.name}</span>
              </div>
              <div className="info-row">
                <label>Username:</label>
                <span>{user.userName}</span>
              </div>
              <div className="info-row">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="info-row">
                <label>Role:</label>
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </div>
              <div className="info-row">
                <label>Member since:</label>
                <span>
                  {user.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'Unknown'
                  }
                </span>
              </div>

              <button 
                onClick={() => setEditing(true)}
                className="edit-profile-btn"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="userName">Username</label>
                <input
                  type="text"
                  id="userName"
                  value={editForm.userName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, userName: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditing(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-stats">
          <h3>Your Activity</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Questions Asked</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Answers Given</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Reputation</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">Badges</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
