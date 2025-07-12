import React from 'react';
import './Admin.css';

const Admin: React.FC = () => {
  const mockReports = [
    {
      id: 'q1',
      type: 'question',
      title: 'How to crash the app intentionally?',
      author: 'trolluser123',
      reason: 'Malicious content',
    },
    {
      id: 'a5',
      type: 'answer',
      title: 'Use `rm -rf` to solve any issue',
      author: 'chaos_dev',
      reason: 'Harmful advice',
    },
  ];

  const mockUsers = [
    { id: 'u1', username: 'spamLord', isBanned: false },
    { id: 'u2', username: 'helpfulHuman', isBanned: true },
  ];

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {/* 🚫 Reported Content */}
      <section>
        <h2>Reported Content</h2>
        {mockReports.map((item) => (
          <div className="admin-card" key={item.id}>
            <div><strong>{item.type.toUpperCase()}</strong>: {item.title}</div>
            <div>Reported by: {item.author}</div>
            <div>Reason: {item.reason}</div>
            <div className="admin-actions">
              <button>Delete</button>
              <button>Ignore</button>
              <button>Ban User</button>
            </div>
          </div>
        ))}
      </section>

      {/* 👥 User Management */}
      <section>
        <h2>Users</h2>
        {mockUsers.map((user) => (
          <div className="admin-card" key={user.id}>
            <div>Username: {user.username}</div>
            <div>Status: {user.isBanned ? '🚫 Banned' : '✅ Active'}</div>
            <div className="admin-actions">
              <button>{user.isBanned ? 'Unban' : 'Ban'}</button>
              <button>View Activity</button>
            </div>
          </div>
        ))}
      </section>

      {/* 📢 Announcements */}
      <section>
        <h2>Platform Message</h2>
        <textarea placeholder="Send message to all users..." rows={3} />
        <button className="send-btn">Send Announcement</button>
      </section>

      {/* 📊 Reports */}
      <section>
        <h2>Reports</h2>
        <button>📥 Download Activity Logs</button>
        <button>📥 Download Swap Stats</button>
        <button>📥 Download Feedback Logs</button>
      </section>
    </div>
  );
};

export default Admin;
