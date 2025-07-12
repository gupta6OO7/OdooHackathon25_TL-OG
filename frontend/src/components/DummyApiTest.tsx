import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Alert,
  Divider,
  Paper
} from '@mui/material';
import { dummyService, DummyResponse } from '../services/dummyService';

const DummyApiTest: React.FC = () => {
  const [response, setResponse] = useState<DummyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postData, setPostData] = useState('{"name": "Test Item", "description": "This is a test item"}');
  const [putData, setPutData] = useState('{"name": "Updated Item", "description": "This item has been updated"}');
  const [itemId, setItemId] = useState('123');

  const handleApiCall = async (apiCall: () => Promise<DummyResponse>, actionName: string) => {
    console.log(`🎯 Frontend: Starting ${actionName} action`);
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setResponse(result);
      console.log(`🎉 Frontend: ${actionName} completed successfully`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      console.error(`💥 Frontend: ${actionName} failed:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRequest = () => {
    handleApiCall(() => dummyService.getDummyData(), 'GET Request');
  };

  const handlePostRequest = () => {
    try {
      const data = JSON.parse(postData);
      handleApiCall(() => dummyService.createDummyData(data), 'POST Request');
    } catch (err) {
      setError('Invalid JSON in POST data');
      console.error('📝 Frontend: Invalid JSON in POST data:', err);
    }
  };

  const handlePutRequest = () => {
    try {
      const data = JSON.parse(putData);
      const id = parseInt(itemId);
      if (isNaN(id)) {
        setError('Item ID must be a valid number');
        return;
      }
      handleApiCall(() => dummyService.updateDummyData(id, data), 'PUT Request');
    } catch (err) {
      setError('Invalid JSON in PUT data');
      console.error('📝 Frontend: Invalid JSON in PUT data:', err);
    }
  };

  const handleDeleteRequest = () => {
    const id = parseInt(itemId);
    if (isNaN(id)) {
      setError('Item ID must be a valid number');
      return;
    }
    handleApiCall(() => dummyService.deleteDummyData(id), 'DELETE Request');
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        🧪 Dummy API Test Interface
      </Typography>
      
      <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
        Test the dummy API endpoints and check console logs on both frontend and backend
      </Typography>

      <Grid container spacing={3}>
        {/* API Controls */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎮 API Controls
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGetRequest}
                  disabled={loading}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  GET Dummy Data
                </Button>
                
                <TextField
                  label="POST Data (JSON)"
                  multiline
                  rows={3}
                  value={postData}
                  onChange={(e) => setPostData(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  size="small"
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={handlePostRequest}
                  disabled={loading}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  POST Dummy Data
                </Button>

                <TextField
                  label="Item ID"
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  size="small"
                />
                
                <TextField
                  label="PUT Data (JSON)"
                  multiline
                  rows={3}
                  value={putData}
                  onChange={(e) => setPutData(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  size="small"
                />
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handlePutRequest}
                  disabled={loading}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  PUT Dummy Data
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteRequest}
                  disabled={loading}
                  fullWidth
                >
                  DELETE Dummy Data
                </Button>
              </Box>

              {loading && (
                <Alert severity="info">
                  🔄 Making API request... Check console logs!
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  ❌ Error: {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Response Display */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📤 API Response
              </Typography>
              
              {response ? (
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {JSON.stringify(response, null, 2)}
                  </Typography>
                </Paper>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No response yet. Make an API call to see the response here.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Instructions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📋 Instructions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" paragraph>
                <strong>🔍 How to test:</strong>
              </Typography>
              <ul>
                <li>
                  <Typography variant="body2">
                    Open your browser's developer console (F12) to see frontend logs
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Check your backend terminal/console to see backend logs
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Click any of the API buttons above to make requests
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Watch both console logs to see the communication flow
                  </Typography>
                </li>
              </ul>
              <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                💡 Tip: Each request will show detailed logs with emojis for easy identification!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DummyApiTest;
