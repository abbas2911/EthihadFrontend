import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/common/admins/Header';
import { motion } from 'framer-motion';

const InjuryReportForm = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [reportMessage, setReportMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        fetchStudentData();
        fetchAdminData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const response = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/view-students');
            setStudents(response.data);
            setFilteredStudents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching student data:', error);
            setLoading(false);
        }
    };

    const fetchAdminData = async () => {
        try {
            const response = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/view-admins');
            setAdmins(response.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    };

    const handleFilter = (filterText) => {
        const lowercasedFilter = filterText.toLowerCase();
        const filteredData = students.filter((student) =>
            `${student.firstName} ${student.lastName}`.toLowerCase().includes(lowercasedFilter)
        );
        setFilteredStudents(filteredData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStudent || !selectedAdmin) {
            alert("Please select both a student and an admin before submitting the report.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/injury-report', {
                studentID: selectedStudent.studentID,
                adminID: selectedAdmin.adminID,
                reportMessage: reportMessage,
            });
            setAlertMessage('Report submitted successfully');
            setAlertSeverity('success');
            setOpenAlert(true);
            setReportMessage('');
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
            <Header title="Submit Injury Report" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Injury Report Form</h2>
                        <p className="text-xs mt-1 text-gray-400">Fill in all the fields to submit an injury report</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Search Student */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Search Student:</label>
                            <input
                                type="text"
                                placeholder="Search for a student by name"
                                onChange={(e) => handleFilter(e.target.value)}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>

                        {loading ? (
                            <p className="text-gray-100">Loading students...</p>
                        ) : (
                            <ul className="bg-gray-800 text-white rounded-md shadow-sm overflow-auto max-h-40 divide-y divide-gray-700">
                                {filteredStudents.map(student => (
                                    <li
                                        key={student.studentID}
                                        onClick={() => setSelectedStudent(student)}
                                        className={`py-2 px-3 cursor-pointer hover:bg-gray-700 ${selectedStudent && selectedStudent.studentID === student.studentID ? 'bg-gray-700' : 'bg-gray-800'}`}
                                    >
                                        {student.firstName} {student.lastName}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Selected Student Display */}
                        {selectedStudent && (
                            <div className="text-gray-100 mt-4">
                                <h3>Selected Student: {selectedStudent.firstName} {selectedStudent.lastName}</h3>
                            </div>
                        )}

                        {/* Admin Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Select Admin:</label>
                            <select
                                onChange={(e) => setSelectedAdmin(admins.find(admin => admin.adminID === parseInt(e.target.value)))}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                required
                            >
                                <option value="">--Select Admin--</option>
                                {admins.map(admin => (
                                    <option key={admin.adminID} value={admin.adminID}>
                                        {admin.firstName} {admin.lastName}
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
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            ></textarea>
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
            </main>
        </div>
    );
};

export default InjuryReportForm;
