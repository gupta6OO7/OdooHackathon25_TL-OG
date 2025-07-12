import React, { useState, useEffect } from 'react';
import { authAPI, authUtils, imageAPI } from '../services/api';
import type { User } from '../services/api';
import './auth-desktop.css';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success && response.data) {
        setUser(response.data.user);
        
        // Fetch profile image if user has one
        if (response.data.user.imageId) {
          try {
            const imageResponse = await imageAPI.getImage(response.data.user.imageId);
            if (imageResponse.success && imageResponse.data) {
              // Convert base64 to data URL for display
              setProfileImage(`data:image/jpeg;base64,${imageResponse.data.bufferString}`);
            }
          } catch (imageError) {
            console.error('Error fetching profile image:', imageError);
          }
        }
      } else {
        setError('Failed to fetch user profile');
      }
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      setError('Error loading profile');
      // If token is invalid, redirect to login
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove token and redirect
      authUtils.removeToken();
      onLogout();
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="error-message">{error}</div>
          <button onClick={handleLogout} className="auth-button">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="dashboard-header">
          <h2>Welcome, {user?.name}!</h2>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        
        <div className="profile-section">
          <div className="profile-info">
            {profileImage && (
              <div className="profile-image">
                <img 
                  src={profileImage} 
                  alt="Profile"
                  className="profile-photo"
                />
              </div>
            )}
            
            <div className="user-details">
              <div className="detail-item">
                <strong>Name:</strong> {user?.name}
              </div>
              <div className="detail-item">
                <strong>Username:</strong> {user?.userName}
              </div>
              <div className="detail-item">
                <strong>Email:</strong> {user?.email}
              </div>
              <div className="detail-item">
                <strong>Role:</strong>
                <span className={`role-badge ${user?.role?.toLowerCase()}`}>
                  {user?.role}
                </span>
              </div>
              <div className="detail-item">
                <strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-button primary">
              View Profile
            </button>
            <button className="action-button secondary">
              Settings
            </button>
            {user?.role === 'ADMIN' && (
              <button className="action-button admin">
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
