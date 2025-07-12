import React from 'react';
import './Notifications.css';

interface Notification {
  id: string;
  type: 'answer' | 'comment' | 'mention';
  content: string;
  createdAt: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'answer',
    content: 'Alice answered your question: "Why is useEffect running twice?"',
    createdAt: '2025-07-12T10:00:00Z',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'comment',
    content: 'Bob commented on your answer: "Try using useMemo."',
    createdAt: '2025-07-11T14:30:00Z',
    isRead: true,
  },
  {
    id: 'n3',
    type: 'mention',
    content: 'Carol mentioned you in a comment: "@omgupta check this out!"',
    createdAt: '2025-07-11T13:10:00Z',
    isRead: false,
  },
];

const Notifications: React.FC = () => {
  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      {mockNotifications.map((n) => (
        <div
          key={n.id}
          className={`notification-card ${n.isRead ? 'read' : 'unread'}`}
        >
          <div className="notification-type">🔔 {n.type.toUpperCase()}</div>
          <div className="notification-content">{n.content}</div>
          <div className="notification-time">
            {new Date(n.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
