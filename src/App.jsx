// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TermProvider } from './context/TermContext';

import Login from './pages/global/Login';
import SignUp from './pages/global/signup';
import Unauthorized from './pages/global/unauthorized';

import ParentRoutes from './routes/ParentRoutes';
import CoachRoutes from './routes/CoachRoutes';
import SuperadminRoutes from './routes/SuperadminRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {
  return (
    <TermProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/parent/*" element={<ParentRoutes />} />
        <Route path="/coach/*" element={<CoachRoutes />} />
        <Route path="/superadmin/*" element={<SuperadminRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </TermProvider>
  );
}

export default App;