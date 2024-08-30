import React, { useState } from 'react';
import axios from 'axios';
import Header from '../../../components/common/admins/Header';
import { motion } from 'framer-motion';

const AddEvent = () => {
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventStartDate, setEventStartDate] = useState('');
    const [eventEndDate, setEventEndDate] = useState('');
    const [notificationStartDate, setNotificationStartDate] = useState('');
    const [notificationEndDate, setNotificationEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token'); // Get token from localStorage

        try {
            const response = await axios.post('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/insertEvent', {
                eventName,
                eventDescription,
                eventStartDate,
                eventEndDate,
                notificationStartDate,
                notificationEndDate
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Add token to Authorization header
                }
            });

            setAlertMessage(response.data.message);
            setAlertMessage('Successfully added Event');
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            console.error('Failed to add event:', error);
            setAlertMessage('Failed to add event');
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
            <Header title="Add Event" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Add Event Form</h2>
                        <p className="text-xs mt-1 text-gray-400">Fill in all the fields to add an event (This event will be displayed to parents based on notification dates)</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Event Name:</label>
                            <input
                                type="text"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Event Description:</label>
                            <textarea
                                value={eventDescription}
                                onChange={(e) => setEventDescription(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Event Start Date:</label>
                            <input
                                type="date"
                                value={eventStartDate}
                                onChange={(e) => setEventStartDate(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Event End Date:</label>
                            <input
                                type="date"
                                value={eventEndDate}
                                onChange={(e) => setEventEndDate(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Notification Start Date:</label>
                            <input
                                type="date"
                                value={notificationStartDate}
                                onChange={(e) => setNotificationStartDate(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Notification End Date:</label>
                            <input
                                type="date"
                                value={notificationEndDate}
                                onChange={(e) => setNotificationEndDate(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {loading ? 'Adding Event...' : 'Add Event'}
                        </button>
                    </form>
                </motion.div>
                <a href="/admin/view-event" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default AddEvent;
