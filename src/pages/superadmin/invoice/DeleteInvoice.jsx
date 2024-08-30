import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/common/admins/Header';
import { motion } from 'framer-motion';

const DeleteInvoice = () => {
    const { invoiceID } = useParams();
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/delete-invoice/${invoiceID}`);
            setAlertMessage(response.data.msg);
            setAlertMessage('Invoice deleted successfully')
            setAlertSeverity('success');
            setOpenAlert(true);

            if (response.data.msg === 'Invoice deleted successfully') {
                setTimeout(() => navigate('/admin/view-invoice'), 1500); // Redirect after a short delay
            }
        } catch (error) {
            console.error('Error deleting invoice:', error);
            setAlertSeverity('error');
            if (error.response && error.response.data && error.response.data.msg) {
                setAlertMessage(error.response.data.msg);
            } else {
                setAlertMessage('Error deleting invoice');
            }
            setOpenAlert(true);
        }
    };

    const toggleConfirmation = () => {
        setConfirmDelete(!confirmDelete);
    };

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Delete Invoice" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Delete Invoice Form</h2>
                        <p className="text-xs mt-1 text-gray-400">You are deleting Invoice ID: {invoiceID}</p>
                    </div>
                    <div>
                        {confirmDelete ? (
                            <div>
                                <p className="text-gray-100 text-sm mb-5">Are you sure you want to delete this Invoice?</p>
                                <div className="flex space-x-4">
                                    <button 
                                        onClick={handleDelete}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Delete Invoice
                                    </button>
                                    <button 
                                        onClick={toggleConfirmation}
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={toggleConfirmation}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </motion.div>
                <a href="/superadmin/view-invoice" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default DeleteInvoice;