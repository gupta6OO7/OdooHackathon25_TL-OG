import React, { useState } from 'react';
import { authAPI, authUtils } from '../services/api';
import type { SignupRequest } from '../services/api';
import './auth-desktop.css';

interface SignupProps {
  onSignupSuccess: () => void;
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<SignupRequest>({
    name: '',
    userName: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Convert file to base64 if selected
      let imageBuffer: string | undefined;
      if (selectedFile) {
        imageBuffer = await authUtils.fileToBase64(selectedFile);
      }

      const signupData: SignupRequest = {
        ...formData,
        imageBuffer
      };

      const response = await authAPI.signup(signupData);
      
      if (response.success && response.data) {
        // Save token to localStorage
        authUtils.saveToken(response.data.token);
        
        // Show success message
        alert(`Welcome, ${response.data.user.name}! Account created successfully.`);
        
        // Call success callback
        onSignupSuccess();
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="brand-panel">
        <div className="brand-content">
          <h1>Join Our Platform</h1>
          <p>Create your account and get started</p>
          <div className="brand-features">
            <div className="feature">
              <span>⚡</span>
              <span>Quick Setup</span>
            </div>
            <div className="feature">
              <span>🛡️</span>
              <span>Secure Registration</span>
            </div>
            <div className="feature">
              <span>🎯</span>
              <span>Role-Based Access</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="auth-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="userName">Username:</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password (min 6 characters)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="profilePhoto">Profile Photo (optional):</label>
            <input
              type="file"
              id="profilePhoto"
              accept="image/*"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <p className="file-info">Selected: {selectedFile.name}</p>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            Already have an account?{' '}
            <button type="button" onClick={onSwitchToLogin} className="link-button">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
