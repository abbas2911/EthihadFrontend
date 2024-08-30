// SuperadminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Sidebar from '../components/common/superadmin/Sidebar';

import SuperadminDashboard from '../pages/superadmin/dashboard/SuperadminDashboard';

import ViewStudent from '../pages/superadmin/students/ViewStudent';
import AddStudent from '../pages/superadmin/students/AddStudent';
import ReadStudent from '../pages/superadmin/students/ReadStudent';
import UpdateStudent from '../pages/superadmin/students/UpdateStudent';
import UpdateSport from '../pages/superadmin/students/UpdateSport';

import ViewTerm from '../pages/superadmin/term/ViewTerm';
import UpdateTerm from '../pages/superadmin/term/UpdateTerm';
import SelectTerm from '../pages/superadmin/term/SelectTerm';
import AddTerm from '../pages/superadmin/term/AddTerm';

import ViewClass from '../pages/superadmin/classes/ViewClass';
import AddClass from '../pages/superadmin/classes/AddClass';
import UpdateClass from '../pages/superadmin/classes/UpdateClass';
import ReadClass from '../pages/superadmin/classes/ReadClass';

import ViewEvent from '../pages/superadmin/event/ViewEvent';
import AddEvent from '../pages/superadmin/event/AddEvent';
import ReadEvent from '../pages/superadmin/event/ReadEvent';
import UpdateEvent from '../pages/superadmin/event/UpdateEvent';
import DeleteEvent from '../pages/superadmin/event/DeleteEvent';

import ViewInvoice from '../pages/superadmin/invoice/ViewInvoice';
import PdfInvoice from '../pages/superadmin/invoice/PDFInvoice';
import AddInvoice from '../pages/superadmin/invoice/AddInvoice'
import ReadInvoice from '../pages/superadmin/invoice/ReadInvoice';
import DeleteInvoice from '../pages/superadmin/invoice/DeleteInvoice';

import ViewDuration from '../pages/superadmin/duration/ViewDuration';
import UpdateDuration from '../pages/superadmin/duration/UpdateDuration';
import AddDurationForm from '../pages/superadmin/duration/AddDurationForm';

import ViewItem from '../pages/superadmin/items/ViewItem';
import UpdateItem from '../pages/admins/items/UpdateItem';
import AddItemForm from '../pages/admins/items/AddItem';

import ViewReceipt from '../pages/superadmin/receipt/ViewReceipt';
import AddReceiptForm from '../pages/superadmin/receipt/AddReceipt';
import ReadReceipt from '../pages/superadmin/receipt/ReadReceipt';
import UpdateReceipt from '../pages/superadmin/receipt/UpdateReceipt';
import PdfReceipt from '../pages/superadmin/receipt/PDFReceipt';

import ViewAdmin from '../pages/superadmin/Admin/ViewAdmin';
import ReadAdmin from '../pages/superadmin/Admin/ReadAdmin';
import AddAdmin from '../pages/superadmin/Admin/AddAdmin';
import UpdateAdmin from '../pages/superadmin/Admin/UpdateAdmin';
import DeleteAdmin from '../pages/superadmin/Admin/DeleteAdmin';


import ViewCoach from '../pages/superadmin/Coach/ViewCoach';
import ReadCoach from '../pages/superadmin/Coach/ReadCoach';
import AddCoach from '../pages/superadmin/Coach/AddCoach';
import UpdateCoach from '../pages/superadmin/Coach/UpdateCoach';
import DeleteCoach from '../pages/superadmin/Coach/DeleteCoach';
 
const SuperadminRoutes = () => (
  <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
    {/* BG */}
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-gray-900 to-yellow-500 opacity-80" />
      <div className="absolute inset-0 backdrop-blur-sm" />
    </div>

    <Sidebar />
    <Routes>
      <Route element={<ProtectedRoute role="superadmin" />}>
        <Route path="dashboard" element={<SuperadminDashboard />} />

        
        <Route path="view-student" element={<ViewStudent />} />
        <Route path="add-student" element={<AddStudent />} />
        <Route path="read-student/:studentID" element={<ReadStudent />} />
        <Route path="update-student/:studentID" element={<UpdateStudent />} />
        <Route path="update-sport/:studentID" element={<UpdateSport />} />

        <Route path="view-term" element={<ViewTerm />} />
        <Route path="update-term/:termID" element={<UpdateTerm />} />
        <Route path="select-term" element={<SelectTerm />} />
        <Route path="add-term" element={<AddTerm />} />

        <Route path="view-class" element={<ViewClass />} />
        <Route path="add-class" element={<AddClass />} />
        <Route path="read-class/:classID" element={<ReadClass />} />
        <Route path="update-class/:classID" element={<UpdateClass />} />

        <Route path="view-event" element={<ViewEvent />} />
        <Route path="add-event" element={<AddEvent />} />
        <Route path="read-event/:eventID" element={<ReadEvent />} />
        <Route path="update-event/:eventID" element={<UpdateEvent />} />
        <Route path="delete-event/:eventID" element={<DeleteEvent />} />

        <Route path="view-invoice" element={<ViewInvoice />} />
        <Route path="pdf-invoice/:invoiceID" element={<PdfInvoice />} />
        <Route path="add-invoice" element={<AddInvoice />} />
        <Route path="read-invoice/:invoiceID" element={<ReadInvoice />} />
        <Route path="delete-invoice/:invoiceID" element={<DeleteInvoice />} />

        <Route path="view-duration" element={<ViewDuration />} />
        <Route path="update-duration/:durationID" element={<UpdateDuration />} />
        <Route path="add-duration" element={<AddDurationForm />} />

        <Route path="view-item" element={<ViewItem />} />
        <Route path="update-item/:itemID" element={<UpdateItem />} />
        <Route path="add-item" element={<AddItemForm />} />

        <Route path="view-receipt" element={<ViewReceipt />} />
        <Route path="add-receipt" element={<AddReceiptForm />} />
        <Route path="read-receipt/:receiptID" element={<ReadReceipt />} />
        <Route path="update-receipt/:receiptID" element={<UpdateReceipt />} />
        <Route path="pdf-receipt/:receiptID" element={<PdfReceipt />} />


        <Route path="view-admin" element={<ViewAdmin />} />
        <Route path="read-admin/:adminID" element={<ReadAdmin />} />
        <Route path="add-admin" element={<AddAdmin />} />
        <Route path="update-admin/:adminID" element={<UpdateAdmin />} />
        <Route path="delete-admin/:adminID" element={<DeleteAdmin />} />

        <Route path="view-coach" element={<ViewCoach />} />
        <Route path="read-coach/:coachID" element={<ReadCoach/>} />
        <Route path="add-coach" element={<AddCoach />} />
        <Route path="update-coach/:coachID" element={<UpdateCoach />} />
        <Route path="delete-coach/:coachID" element={<DeleteCoach />} />
      </Route>
    </Routes>
  </div>
);

export default SuperadminRoutes;
