import React, { useState } from 'react';
import axios from 'axios';
import Header from '../../../components/common/parents/Header'; // Assuming you have a header component

const ParentComplaintForm = () => {
    const [formData, setFormData] = useState({
        studentID: '', // Optional, if the complaint is linked to a student
        complaintMessage: '',
    });

    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            await axios.post('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/parent/submit-complaint', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            setAlertMessage('Complaint submitted successfully');
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            setAlertMessage('Error submitting complaint');
            setAlertSeverity('error');
            setOpenAlert(true);
            console.error('Error submitting complaint:', error);
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
            <Header title="Submit a Complaint" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8">
                    <h2 className="text-xl font-semibold text-gray-100">Complaint Form</h2>
                    <p className="text-xs mt-1 text-gray-400">Please fill in the details to submit your complaint.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Complaint Message</label>
                                <textarea
                                    placeholder="Describe your complaint"
                                    name="complaintMessage"
                                    value={formData.complaintMessage}
                                    onChange={handleChange}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                    required
                                />
                            </div>

                            
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Student ID *</label>
                                <input
                                    placeholder="Enter the Student ID"
                                    type="text"
                                    name="studentID"
                                    value={formData.studentID}
                                    onChange={handleChange}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                />
                            </div>

                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Submit Complaint
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {openAlert && (
                <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg text-white ${alertSeverity === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    <span>{alertMessage}</span>
                </div>
            )}
        </div>
    );
};

export default ParentComplaintForm;
