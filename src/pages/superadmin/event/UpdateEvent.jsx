import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../../../components/common/admins/Header';

const UpdateEvent = () => {
    const { eventID } = useParams();
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);
    const [formData, setFormData] = useState({
        eventName: '',
        eventDescription: '',
        eventStartDate: '',
        eventEndDate: '',
        notificationStartDate: '',
        notificationEndDate: ''
    });

    useEffect(() => {
        fetchEventDetails();
    }, []);

    const fetchEventDetails = async () => {
        try {
            const response = await axios.get(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/read-event/${eventID}`);
            
            // Format the dates to yyyy-mm-dd
            const formatDate = (dateStr) => {
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) {
                    console.error('Invalid date:', dateStr);
                    return ''; // Fallback to an empty string if parsing fails
                }
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
    
            setFormData({
                eventName: response.data.eventName || '',
                eventDescription: response.data.eventDescription || '',
                eventStartDate: formatDate(response.data.eventStartDate) || '',
                eventEndDate: formatDate(response.data.eventEndDate) || '',
                notificationStartDate: formatDate(response.data.notificationStartDate) || '',
                notificationEndDate: formatDate(response.data.notificationEndDate) || ''
            });
        } catch (error) {
            console.error('Error fetching term details:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/update-event/${eventID}`, formData);
            setAlertMessage('Successfully updated event');
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            console.error('Error updating event:', error);
            setAlertMessage('Failed to update event');
            setAlertSeverity('error');
            setOpenAlert(true);
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
            <Header title="Update Event" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Update Event Form</h2>
                        <p className="text-xs mt-1 text-gray-400">Update the fields you want to change</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Event Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">
                                Event Name
                            </label>
                            <input
                                type="text"
                                name="eventName"
                                value={formData.eventName}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                required
                            />
                        </div>
                        {/* Event Description Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-100">
                                Description
                            </label>
                            <textarea
                                name="eventDescription"
                                value={formData.eventDescription}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        {/* Event Start Date Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-100">
                                Event Start Date
                            </label>
                            <input
                                type="date"
                                name="eventStartDate"
                                value={formData.eventStartDate}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        {/* Event End Date Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-100">
                                Event End Date
                            </label>
                            <input
                                type="date"
                                name="eventEndDate"
                                value={formData.eventEndDate}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        {/* Notification Start Date Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-100">
                                Notification Start Date
                            </label>
                            <input
                                type="date"
                                name="notificationStartDate"
                                value={formData.notificationStartDate}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        {/* Notification End Date Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-100">
                                Notification End Date
                            </label>
                            <input
                                type="date"
                                name="notificationEndDate"
                                value={formData.notificationEndDate}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Update Event
                        </button>
                    </form>
                </motion.div>
                <a href="/superadmin/view-event" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default UpdateEvent;
