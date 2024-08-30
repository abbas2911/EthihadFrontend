// Unauthorized.jsx
import React from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';

const Unauthorized = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', marginBottom: '20px' }}>
        <Alert severity="error">
          <AlertTitle>Unauthorized Access</AlertTitle>
          You are not authorized to view this page. Please log in or contact the administrator for access.
        </Alert>
      </div>
      <Button variant="contained" color="primary" href="/login" style={{ width: '200px', height: '50px' }}>
        Login
      </Button>
    </div>
  );
};

export default Unauthorized;