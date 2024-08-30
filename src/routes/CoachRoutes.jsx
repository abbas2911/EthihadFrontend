// CoachRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';

import CoachDashboard from '../pages/coaches/dashboard/CoachDashboard';

import Attendance from '../pages/coaches/attendence/Attendance';
import MarkAttendance from '../pages/coaches/attendence/MarkAttendance';

import Gradebook from '../pages/coaches/gradebook/Gradebook';
import MarkGradebook from '../pages/coaches/gradebook/MarkGradebook';

import Gallery from '../pages/coaches/gallery/Gallery';
import AddPhotos from '../pages/coaches/gallery/AddPhotos';

import Certificate from '../pages/coaches/certificate/Certificate';
import MarkCertificate from '../pages/coaches/certificate/MarkCertificate';

import { Sidebar } from '../components/common/coaches/Sidebar';

const CoachRoutes = () => (
  <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
    {/* BG */}
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-gray-900 to-yellow-500 opacity-80" />
      <div className="absolute inset-0 backdrop-blur-sm" />
    </div>

    <Sidebar />
    <Routes>
        <Route element={<ProtectedRoute role="coach" />}>
            <Route path="dashboard" element={<CoachDashboard />} />
            
            <Route path="attendance" element={<Attendance />} />
            <Route path='mark-attendance/:classID' element={<MarkAttendance />} />

            <Route path='gradebook' element={<Gradebook />} />
            <Route path='mark-gradebook/:classID' element={<MarkGradebook />} />

            <Route path="gallery" element={<Gallery />} />
            <Route path="add-photos/:classID" element={<AddPhotos />} />

            <Route path="certificate" element={<Certificate />} />
            <Route path="mark-certificate/:classID" element={<MarkCertificate />} />
        </Route>
    </Routes>
  </div>
);

export default CoachRoutes;