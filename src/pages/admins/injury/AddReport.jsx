import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../../../components/common/admins/Header';

const InjuryReportForm = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState('');
    const [reportMessage, setReportMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/fetchStudentID')
          .then(response => setStudents(response.data))
          .catch(error => console.error('Error fetching students:', error));

        axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/view-admins')
          .then(response => setAdmins(response.data))
          .catch(error => console.error('Error fetching admins:', error));
    }, []);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        // Filter students based on search term
        const filtered = students.filter(student =>
          student.firstName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredStudents(filtered);
    };

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setSearchTerm(student.firstName);
        setFilteredStudents([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/injury-report', {
                studentID: selectedStudent.studentID,
                adminID: selectedAdmin,
                reportMessage: reportMessage,
            });
            setAlertMessage('Report submitted successfully');
            setAlertSeverity('success');
            setOpenAlert(true);
            setReportMessage('');  
            setSelectedStudent(null);
            setSelectedAdmin('');
        } catch (error) {
            console.error('Error submitting report:', error);
            setAlertMessage('Failed to submit report');
            setAlertSeverity('error');
            setOpenAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Add Injury Report" />  
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Injury Report Form</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Student Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Student:</label>
                            {selectedStudent ? (
                                <div className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900 bg-green-100">
                                    Selected Student: {selectedStudent.firstName}
                                    <button 
                                        onClick={() => setSelectedStudent(null)}
                                        className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Change Student
                                    </button>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Search by student name"
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                />
                            )}

                            {filteredStudents.length > 0 && !selectedStudent && (
                                <ul className="mt-2 bg-gray border border-gray-300 rounded-md max-h-48 overflow-y-auto">
                                    {filteredStudents.map(student => (
                                        <li
                                            key={student.studentID}
                                            className="p-2 hover:bg-gray-900 cursor-pointer"
                                            onClick={() => handleStudentSelect(student)}
                                        >
                                            {student.firstName}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Admin Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Select Admin:</label>
                            <select
                                value={selectedAdmin}
                                onChange={(e) => setSelectedAdmin(e.target.value)}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select Admin</option>
                                {admins.map(admin => (
                                    <option key={admin.adminID} value={admin.adminID}>
                                        {admin.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Injury Report */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Injury Report:</label>
                            <textarea
                                placeholder="Write injury report here"
                                value={reportMessage}
                                onChange={(e) => setReportMessage(e.target.value)}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
                        >
                            {loading ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </form>
                </motion.div>
            </main>
            {openAlert && (
                <motion.div
                    className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg text-white ${alertSeverity === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    exit={{ opacity: 0, x: 100 }}
                >
                    <div className="flex items-center justify-between">
                        <span>{alertMessage}</span>
                        <button
                            type="button"
                            className="ml-4 text-white hover:text-gray-200"
                            onClick={handleCloseAlert}
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default InjuryReportForm;