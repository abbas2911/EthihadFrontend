import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/common/superadmin/Header';
import { useParams } from 'react-router-dom';

const ReadAdmin = () => {
    const { adminID } = useParams();
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/read-admin/${adminID}`);
                setAdmin(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch admin details:', error);
                setAlertMessage('Failed to fetch admin details');
                setAlertSeverity('error');
                setOpenAlert(true);
                setLoading(false);
            }
        };
        fetchAdmin();
    }, [adminID]);

    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Read Admin" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8">
                    <h2 className="text-xl font-semibold text-gray-100">Admin Details</h2>
                    <div className="mt-4">
                        <p className="text-gray-300">Username: {admin.username}</p>
                        <p className="text-gray-300">First Name: {admin.firstName}</p>
                        <p className="text-gray-300">Last Name: {admin.lastName}</p>
                        <p className="text-gray-300">Email: {admin.email}</p>
                        <p className="text-gray-300">Phone: {admin.phone}</p>
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

export default ReadAdmin;
