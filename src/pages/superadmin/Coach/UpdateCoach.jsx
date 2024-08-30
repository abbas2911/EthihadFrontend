import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../../../components/common/superadmin/Header';

const UpdateCoach = () => {
    const { coachID } = useParams();
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        type: '',
        locationID: ''
    });
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        fetchCoachDetails();
        fetchLocations();
    }, []);

    const fetchCoachDetails = async () => {
        try {
            const response = await axios.get(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/read-coach/${coachID}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching coach details:', error);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/fetchLocation');
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
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
            await axios.put(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/update-coach/${coachID}`, formData);
            setAlertMessage('Successfully updated coach');
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            console.error('Error updating coach:', error);
            setAlertMessage('Failed to update coach');
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
            <Header title="Update Coach" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Update Coach Form</h2>
                        <p className="text-xs mt-1 text-gray-400">Update the fields you wish to change</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                required
                            />
                        </div>

                        {/* Password Field (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Password (optional)</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>

                        {/* First Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                required
                            />
                        </div>

                        {/* Last Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-100">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                required
                            />
                        </div>

                        {/* Phone Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-100">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>

                        {/* Type Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-100">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                required
                            >
                                <option value="general">General</option>
                                <option value="elite">Elite</option>
                            </select>
                        </div>

                        {/* Location Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-100">Location</label>
                            <select
                                name="locationID"
                                value={formData.locationID}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                required
                            >
                                <option value="">Select Location</option>
                                {locations.map((location) => (
                                    <option key={location.locationID} value={location.locationID}>
                                        {location.locationName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Update Coach
                        </button>
                    </form>
                </motion.div>
                <a href="/superadmin/view-coach" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default UpdateCoach;
