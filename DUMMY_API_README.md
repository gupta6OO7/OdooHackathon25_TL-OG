# 🧪 Dummy API Test Setup

This setup provides a complete dummy API testing environment with frontend and backend console logging.

## 🚀 Quick Start

### 1. Install Dependencies

**Backend:**
```powershell
cd backend
npm install
```

**Frontend:**
```powershell
cd frontend
npm install
```

### 2. Start the Backend (Terminal 1)
```powershell
cd backend
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📊 Health check: http://localhost:3001/health
🧪 Dummy API: http://localhost:3001/api/dummy
```

### 3. Start the Frontend (Terminal 2)
```powershell
cd frontend
npm start
```

The frontend will open at http://localhost:3000

### 4. Test the Dummy API

1. Open the frontend at http://localhost:3000
2. Click on the "🧪 API Test" tab
3. Open browser console (F12) to see frontend logs
4. Check backend terminal to see backend logs
5. Click any of the API buttons to test different endpoints

## 🎯 Available Dummy Endpoints

- **GET** `/api/dummy` - Get dummy data
- **POST** `/api/dummy` - Create dummy data
- **PUT** `/api/dummy/:id` - Update dummy data
- **DELETE** `/api/dummy/:id` - Delete dummy data

## 📝 Console Logging

### Frontend Console (Browser F12)
- 🌐 API request initiation
- ✅ Successful responses
- ❌ Error responses
- 📥📤 Request/response data

### Backend Console (Terminal)
- 🔥 Endpoint hits
- 📝 Request details (headers, body, params)
- 📤 Response data

## 🎨 Features

- **Beautiful UI** with Material-UI components
- **Real-time logging** on both frontend and backend
- **Error handling** with user-friendly messages
- **JSON editing** for POST/PUT requests
- **Response display** with formatted JSON
- **Easy testing** with pre-filled sample data

## 🔧 Troubleshooting

If you encounter any issues:

1. **Port conflicts**: Make sure ports 3000 and 3001 are available
2. **CORS errors**: The backend is configured to accept requests from localhost:3000
3. **Dependencies**: Run `npm install` in both frontend and backend directories
4. **Environment**: The .env files are already configured for local development

Enjoy testing your dummy API! 🎉
