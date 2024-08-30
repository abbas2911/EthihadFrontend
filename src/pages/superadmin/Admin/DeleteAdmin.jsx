import React, { useState } from 'react';
import axios from 'axios';
import Header from '../../../components/common/superadmin/Header';
import { useParams, useNavigate } from 'react-router-dom';

const DeleteAdmin = () => {
    const { adminID } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    const handleDelete = async () => {
        setLoading(true);

        const token = localStorage.getItem('token'); // Get token from localStorage

        try {
            const response = await axios.delete(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/delete-admin/${adminID}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Add token to Authorization header
                }
            });

            setAlertMessage(response.data.message);
            setAlertSeverity('success');
            setOpenAlert(true);
            navigate('/superadmin/view-admin');
        } catch (error) {
            console.error('Failed to delete admin:', error);
            setAlertMessage('Failed to delete admin');
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
            <Header title="Delete Admin" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8">
                    <h2 className="text-xl font-semibold text-gray-100">Are you sure you want to delete this admin?</h2>
                    <div className="mt-4">
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            {loading ? 'Deleting...' : 'Delete Admin'}
                        </button>
                    </div>
                </div>
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

export default DeleteAdmin;
