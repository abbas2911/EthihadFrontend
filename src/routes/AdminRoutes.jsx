// AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import { Sidebar } from '../components/common/admins/Sidebar';

import AdminDashboard from '../pages/admins/dashboard/AdminDashboard'

import ViewStudent from '../pages/admins/students/ViewStudent';
import AddStudent from '../pages/admins/students/AddStudent';
import ReadStudent from '../pages/admins/students/ReadStudent';
import UpdateStudent from '../pages/admins/students/UpdateStudent';
import UpdateStudentSport from '../pages/admins/students/UpdateStudentSport';

import ViewTerm from '../pages/admins/term/ViewTerm';
import UpdateTerm from '../pages/admins/term/UpdateTerm';
import SelectTerm from '../pages/admins/term/SelectTerm';
import AddTerm from '../pages/admins/term/AddTerm';

import ViewClass from '../pages/admins/classes/ViewClass';
import AddClass from '../pages/admins/classes/AddClass';
import UpdateClass from '../pages/admins/classes/UpdateClass';
import ReadClass from '../pages/admins/classes/ReadClass';

import ViewEvent from '../pages/admins/event/ViewEvent';
import AddEvent from '../pages/admins/event/AddEvent';
import ReadEvent from '../pages/admins/event/ReadEvent';
import UpdateEvent from '../pages/admins/event/UpdateEvent';

import DeleteEvent from '../pages/admins/event/DeleteEvent';

import ViewInvoice from '../pages/admins/invoice/ViewInvoice';
import PdfInvoice from '../pages/admins/invoice/PDFInvoice';
import AddInvoice from '../pages/admins/invoice/AddInvoice';
import ReadInvoice from '../pages/admins/invoice/ReadInvoice';
import DeleteInvoice from '../pages/admins/invoice/DeleteInvoice';

import ViewDuration from '../pages/admins/duration/ViewDuration';
import UpdateDuration from '../pages/admins/duration/UpdateDuration';
import AddDurationForm from '../pages/admins/duration/AddDurationForm';

import ViewItem from '../pages/admins/items/ViewItem';
import UpdateItem from '../pages/admins/items/UpdateItem';
import AddItemForm from '../pages/admins/items/AddItem';

import ViewReceipt from '../pages/admins/receipt/ViewReceipt';
import AddReceiptForm from '../pages/admins/receipt/AddReceipt';
import ReadReceipt from '../pages/admins/receipt/ReadReceipt';
import UpdateReceipt from '../pages/admins/receipt/UpdateReceipt';
import PdfReceipt from '../pages/admins/receipt/PDFReceipt';

import ViewSport from '../pages/admins/sport/ViewSport';
import AddSport from '../pages/admins/sport/AddSport';
import UpdateSport from '../pages/admins/sport/UpdateSport';

import ViewLocation from '../pages/admins/location/ViewLocation';
import AddLocation from '../pages/admins/location/AddLocation';
import UpdateLocation from '../pages/admins/location/UpdateLocation';

import ViewAgeCategory from '../pages/admins/ageCategory/ViewAgeCategory';
import AddAgeCategory from '../pages/admins/ageCategory/AddAgeCategory';
import UpdateAgeCategory from '../pages/admins/ageCategory/UpdateAgeCategory';

import ViewComplaints from '../pages/admins/complaints/ViewComplaint';

import ViewCoaches from '../pages/admins/Coache/ViewCoaches';
import AddAttendance from '../pages/admins/Coache/AddAttendance';

import InjuryReportForm from '../pages/admins/injury/AddReport';

const AdminRoutes = () => (
  <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
    {/* BG */}
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-gray-900 to-yellow-500 opacity-80" />
      <div className="absolute inset-0 backdrop-blur-sm" />
    </div>

    <Sidebar />
    <Routes>
        <Route element={<ProtectedRoute role="admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />

            <Route path="view-student" element={<ViewStudent />} />
            <Route path="add-student" element={<AddStudent />} />
            <Route path="read-student/:studentID" element={<ReadStudent />} />
            <Route path="update-student/:studentID" element={<UpdateStudent />} />
            <Route path="update-studentsport/:studentID" element={<UpdateStudentSport />} />

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

            <Route path="view-sport" element={<ViewSport />} />
            <Route path="add-sport" element={<AddSport />} />
            <Route path="update-sport/:sportID" element={<UpdateSport />} />

            <Route path="view-location" element={<ViewLocation />} />
            <Route path="add-location" element={<AddLocation />} />
            <Route path="update-location/:locationID" element={<UpdateLocation />} />

            <Route path="view-agecategory" element={<ViewAgeCategory />} />
            <Route path="add-agecategory" element={<AddAgeCategory />} />
            <Route path="update-agecategory/:ageCategoryID" element={<UpdateAgeCategory />} />

            <Route path="view-complaints" element={<ViewComplaints />} />

            <Route path="view-coaches" element={<ViewCoaches />} />
            <Route path="add-attendance" element={<AddAttendance />} />
            
            <Route path="add-report" element={<InjuryReportForm />} />

        </Route>
    </Routes>
  </div>
);

export default AdminRoutes;