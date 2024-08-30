import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/common/superadmin/Header';
import { motion } from 'framer-motion';

const AddDurationForm = () => {
    const [durationName, setDurationName] = useState('');
    const [durationDescription, setDurationDescription] = useState('');
    const [sportID, setSportID] = useState('');
    const [sports, setSports] = useState([]);
    const [numberOfSessions, setNumberOfSessions] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        const fetchSport = async () => {
            try {
                const response = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/fetchSport');
                setSports(response.data);
            } catch (error) {
                console.error('Error fetching sports:', error);
            }
        };

        fetchSport();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token'); // Get token from localStorage

        try {
            const response = await axios.post('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/insertDuration', {
                durationName,
                durationDescription,
                sportID,
                numberOfSessions,
                price
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Add token to Authorization header
                }
            });

            setAlertMessage(response.data.message);
            setAlertMessage('Successfully Added Duration');
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            console.error('Failed to add duration:', error);
            setAlertMessage('Failed to add duration');
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
            <Header title="Add Duration" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Add Duration Form</h2>
                        <p className="text-xs mt-1 text-gray-400">Fill in all the fields to add a duration</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Duration Name:</label>
                            <input
                                type="text"
                                value={durationName}
                                onChange={(e) => setDurationName(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Duration Description:</label>
                            <textarea
                                value={durationDescription}
                                onChange={(e) => setDurationDescription(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Sport:</label>
                            <select
                                value={sportID}
                                onChange={(e) => setSportID(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select a Sport</option>
                                {sports.map(sport => (
                                    <option key={sport.sportID} value={sport.sportID}>
                                        {sport.sportName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Number of Sessions:</label>
                            <input
                                type="number"
                                value={numberOfSessions}
                                onChange={(e) => setNumberOfSessions(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Price:</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {loading ? 'Adding Duration...' : 'Add Duration'}
                        </button>
                        {alertMessage && <p className="mt-2 text-gray-600">{alertMessage}</p>}
                    </form>
                </motion.div>
                <a href="/superadmin/view-duration" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default AddDurationForm;
