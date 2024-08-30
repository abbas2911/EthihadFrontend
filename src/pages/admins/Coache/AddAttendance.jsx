import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/common/admins/Header';
import { motion } from 'framer-motion';

const AddAttendance = () => {
    const [coaches, setCoaches] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [attendanceDate, setAttendanceDate] = useState('');
    const [status, setStatus] = useState('present');
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        fetchCoaches();
        fetchLocations();
    }, []);

    const fetchCoaches = async () => {
        try {
            const response = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/fetchCoaches');
            setCoaches(response.data);
        } catch (error) {
            console.error('Error fetching coaches:', error);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/fetchlocationID');
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const attendanceData = {
                coachID: selectedCoach,
                locationID: selectedLocation,
                attendanceDate, // Already in yyyy-mm-dd format
                status
            };
            await axios.post('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/add-attendance', attendanceData);
            setAlertMessage('Attendance submitted successfully');
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            console.error('Error submitting attendance:', error);
            setAlertMessage('Error submitting attendance');
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
            <Header title="Add Attendance" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Mark Coach Attendance</h2>
                        <p className="text-xs mt-1 text-gray-400">Fill in all fields to mark attendance</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Select Coach:</label>
                            <select
                                value={selectedCoach}
                                onChange={(e) => setSelectedCoach(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select a Coach</option>
                                {coaches.map((coach) => (
                                    <option key={coach.coachID} value={coach.coachID}>
                                        {coach.firstName} {coach.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-100">Select Location:</label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select a Location</option>
                                {locations.map((location) => (
                                    <option key={location.locationID} value={location.locationID}>
                                        {location.locationName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-100">Select Date:</label>
                            <input
                                type="date"
                                value={attendanceDate}
                                onChange={(e) => setAttendanceDate(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-100">Status:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {loading ? 'Submitting Attendance...' : 'Submit Attendance'}
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
                                onClick={() => setOpenAlert(false)}
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

export default AddAttendance;
