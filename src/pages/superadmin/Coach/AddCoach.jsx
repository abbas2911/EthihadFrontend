import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/common/superadmin/Header';
import { motion } from 'framer-motion';

const AddCoach = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('');
    const [locationID, setLocationID] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        // Fetch locations from backend
        const fetchLocations = async () => {
            try {
                const response = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/fetchLocation');
                setLocations(response.data);
            } catch (error) {
                console.error('Failed to fetch locations:', error);
                setAlertMessage('Failed to fetch locations');
                setAlertSeverity('error');
                setOpenAlert(true);
            }
        };

        fetchLocations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token'); // Get token from localStorage

        try {
            const response = await axios.post('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/add-coach', {
                username,
                password,
                firstName,
                lastName,
                email,
                phone,
                type,
                locationID
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Add token to Authorization header
                }
            });

            setAlertMessage(response.data.message);
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            console.error('Failed to add coach:', error);
            setAlertMessage('Failed to add coach');
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
            <Header title="Add Coach" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Add Coach Form</h2>
                        <p className="text-xs mt-1 text-gray-400">Fill in all the fields to add a coach</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">First Name:</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Last Name:</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Phone:</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Type:</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="" disabled>Select Type</option>
                                <option value="general">General</option>
                                <option value="elite">Elite</option>
                            </select>
                        </div>
                        {/* Location ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Location:</label>
                            <select
                                value={locationID}
                                onChange={(e) => setLocationID(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="" disabled>Select Location</option>
                                {locations.map(location => (
                                    <option key={location.locationID} value={location.locationID}>
                                        {location.locationName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {loading ? 'Adding Coach...' : 'Add Coach'}
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

export default AddCoach;
