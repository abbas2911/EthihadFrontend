// ParentRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

import ParentDashboard from '../pages/parents/dashboard/ParentDashboard';
import RegisterStudent from '../pages/parents/registerStudent/RegisterStudent';
import ChooseSport from '../pages/parents/chooseSport/ChooseSport';
import Gallery from '../pages/parents/gallery/gallery';
import ViewCertificate from '../pages/parents/certificate/ViewCertificate';
import PdfCertificate from '../pages/parents/certificate/PdfCertificate';
import ViewSessions from '../pages/parents/sessions/ViewSessions';
import ParentComplaintForm from '../pages/parents/complaint/ComplaintForm';
import ViewInjuryReports from '../pages/parents/injury/ViewReport';

import { Sidebar } from '../components/common/parents/Sidebar';


const ParentRoutes = () => (
  <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
    {/* BG */}
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-gray-900 to-yellow-500 opacity-80" />
      <div className="absolute inset-0 backdrop-blur-sm" />
    </div>

    <Sidebar />
    <Routes>
        <Route element={<ProtectedRoute role="parent" />}>
            <Route path="dashboard" element={<ParentDashboard />} />
            <Route path="register-student" element={<RegisterStudent />} />
            <Route path='choose-sport' element={<ChooseSport />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="view-certificate" element={<ViewCertificate />} />
            <Route path="pdf-certificate/:studentID/:coachID/:classID" element={<PdfCertificate />} />
            <Route path="view-sessions" element={<ViewSessions />} />
            <Route path="complaint" element={<ParentComplaintForm />} />
            <Route path="report" element={<ViewInjuryReports />} />
        </Route>
    </Routes>
  </div>
);

export default ParentRoutes;