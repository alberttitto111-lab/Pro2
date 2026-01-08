import React, { useState } from 'react';
import { Button, TextField, Box, Alert } from '@mui/material';
import API from '../services/api';

const TestContact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    
    try {
      // First test the endpoint
      const testResponse = await API.get('/test/test');
      console.log('Test endpoint:', testResponse.data);
      
      // Then send notification
      const response = await API.post('/notifications', {
        name,
        email,
        subject,
        message
      });
      
      console.log('Notification response:', response.data);
      setResult(`✅ Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        setResult(`❌ Error ${error.response.status}: ${JSON.stringify(error.response.data, null, 2)}`);
      } else {
        setResult(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <h1>Test Contact Form</h1>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
        <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} fullWidth margin="normal" />
        <TextField label="Message" value={message} onChange={(e) => setMessage(e.target.value)} fullWidth multiline rows={4} margin="normal" />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Sending...' : 'Send Test'}
        </Button>
      </form>
      {result && (
        <Alert severity={result.includes('✅') ? 'success' : 'error'} sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
          {result}
        </Alert>
      )}
    </Box>
  );
};

export default TestContact;