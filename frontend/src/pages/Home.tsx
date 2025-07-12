import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { apiService } from '../services/api';

interface ApiStatus {
  success: boolean;
  message: string;
  timestamp: string;
}

const Home: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkApiStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get('/health');
      setApiStatus(response.data);
    } catch (err) {
      setError('Failed to connect to API');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Welcome to AskUp
      </Typography>
      
      <Typography variant="h6" component="p" gutterBottom align="center" color="textSecondary">
        Your Full-Stack Q&A Platform
      </Typography>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Frontend
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Built with React + TypeScript + Material-UI
              </Typography>
              <Typography variant="body2">
                • Modern React with hooks<br/>
                • TypeScript for type safety<br/>
                • Material-UI for beautiful components<br/>
                • React Router for navigation
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Backend API Status
              </Typography>
              
              {loading && (
                <Box display="flex" alignItems="center" gap={2}>
                  <CircularProgress size={20} />
                  <Typography>Checking API connection...</Typography>
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {apiStatus && !loading && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  ✅ Backend Connected: {apiStatus.message}
                </Alert>
              )}

              <Typography variant="body2" color="textSecondary" paragraph>
                Backend built with Node.js + TypeScript + Express + TypeORM
              </Typography>

              <Button 
                variant="outlined" 
                onClick={checkApiStatus}
                disabled={loading}
              >
                Refresh API Status
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }} elevation={2}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Project Structure
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Backend Structure:</Typography>
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
{`backend/
├── src/
│   ├── api/           # API routes
│   ├── constants/     # App constants
│   ├── controller/    # Request controllers
│   ├── entities/      # Database entities
│   ├── helpers/       # Utility functions
│   ├── interfaces/    # TypeScript interfaces
│   ├── middlewares/   # Express middlewares
│   ├── migrations/    # Database migrations
│   ├── server/        # Server configuration
│   ├── services/      # Business logic
│   ├── types/         # Type definitions
│   ├── app.ts         # Main app file
│   └── datasource.ts  # Database config`}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Frontend Structure:</Typography>
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
{`frontend/
├── src/
│   ├── components/    # Reusable components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── types/         # TypeScript types
│   ├── hooks/         # Custom hooks
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main app component
│   └── index.tsx      # Entry point`}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home;
