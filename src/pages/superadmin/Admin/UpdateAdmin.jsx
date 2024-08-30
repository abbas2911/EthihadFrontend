import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/common/superadmin/Header';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const UpdateAdmin = () => {
    const { adminID } = useParams();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/read-admin/${adminID}`);
                const { username, firstName, lastName, email, phone } = response.data;
                setUsername(username);
                setFirstName(firstName);
                setLastName(lastName);
                setEmail(email);
                setPhone(phone);
            } catch (error) {
                console.error('Failed to fetch admin details:', error);
                setAlertMessage('Failed to fetch admin details');
                setAlertSeverity('error');
                setOpenAlert(true);
            }
        };
        fetchAdmin();
    }, [adminID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token'); // Get token from localStorage

        try {
            const response = await axios.put(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/update-admin/${adminID}`, {
                username,
                password,
                firstName,
                lastName,
                email,
                phone
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Add token to Authorization header
                }
            });

            setAlertMessage(response.data.message);
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            console.error('Failed to update admin:', error);
            setAlertMessage('Failed to update admin');
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
            <Header title="Update Admin" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Update Admin Form</h2>
                        <p className="text-xs mt-1 text-gray-400">Update admin details</p>
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
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {loading ? 'Updating Admin...' : 'Update Admin'}
                        </button>
                    </form>
                </motion.div>
                <a href="/superadmin/view-admin" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default UpdateAdmin;
