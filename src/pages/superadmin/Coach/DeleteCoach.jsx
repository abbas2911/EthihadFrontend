import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../../../components/common/superadmin/Header'; // Adjust the path if needed

const DeleteCoach = () => {
    const { coachID } = useParams();
    const navigate = useNavigate();
    const [coach, setCoach] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        fetchCoachDetails();
    }, []);

    const fetchCoachDetails = async () => {
        try {
            const response = await axios.get(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/read-coach/${coachID}`);
            setCoach(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching coach details:', error);
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/delete-coach/${coachID}`);
            setAlertMessage(`Coach ${response.data.username} successfully deleted`);
            setAlertSeverity('success');
            setOpenAlert(true);
            setTimeout(() => navigate('/superadmin/view-coach'), 1500); // Redirect after a short delay
        } catch (error) {
            console.error('Error deleting coach:', error);
            setAlertMessage('Failed to delete coach');
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!coach) {
        return <div>Coach not found.</div>;
    }

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Delete Coach" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Are you sure you want to delete this coach?</h2>
                    </div>

                    <div className="text-gray-300 space-y-4 mb-6">
                        <p><strong>Coach ID:</strong> {coach.coachID}</p>
                        <p><strong>First Name:</strong> {coach.firstName}</p>
                        <p><strong>Last Name:</strong> {coach.lastName}</p>
                        <p><strong>Email:</strong> {coach.email}</p>
                        <p><strong>Phone:</strong> {coach.phone}</p>
                    </div>

                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Delete Coach
                    </button>
                </motion.div>
                <a href="/superadmin/view-coach" className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default DeleteCoach;
