import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/common/admins/Header';
import { motion } from 'framer-motion';

const AddReceiptForm = () => {
    const [invoiceID, setInvoiceID] = useState('');
    const [invoiceList, setInvoiceList] = useState([]);
    const [paymentDate, setPaymentDate] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        // Fetch all invoice IDs
        const fetchInvoices = async () => {
            try {
                const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/getInvoiceIDs');
                setInvoiceList(response.data);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };
        fetchInvoices();
    }, []);

    useEffect(() => {
        // Fetch amount when invoiceID changes
        const fetchInvoiceAmount = async () => {
            if (invoiceID) {
                try {
                    const response = await axios.get(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/getInvoiceAmount/${invoiceID}`);
                    setAmount(response.data.amount);
                } catch (error) {
                    console.error('Error fetching invoice amount:', error);
                    setAmount('');
                }
            }
        };
        fetchInvoiceAmount();
    }, [invoiceID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token'); // Get token from localStorage

        try {
            const response = await axios.post('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/insertReceipt', {
                invoiceID,
                paymentDate,
                paymentMode,
                amount,
                status,
                description
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Add token to Authorization header
                }
            });

            setAlertMessage(response.data.message);
            setAlertMessage('Successfully Added Receipt');
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            console.error('Failed to add receipt:', error);
            setAlertMessage('Failed to add receipt');
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
            <Header title="Add Receipt" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Add Receipt Form</h2>
                        <p className="text-xs mt-1 text-gray-400">Fill in all the fields to add a receipt</p>
                        <p className='text-sm mt-1 text-red-400'><strong>Note:</strong> Ensure you select the correct Invoice ID, as it 
                        affects the update and changes to student sessions.</p>

                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Invoice ID:</label>
                            <select
                                value={invoiceID}
                                onChange={(e) => setInvoiceID(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select Invoice ID</option>
                                {invoiceList.map((invoice) => (
                                    <option key={invoice.invoiceID} value={invoice.invoiceID}>
                                        {invoice.invoiceID}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Payment Date:</label>
                            <input
                                type="date"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Payment Mode:</label>
                            <input
                                type="text"
                                value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Amount:</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900 bg-gray-400"
                                readOnly
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
                                <option value="">Select Status</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Description:</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {loading ? 'Adding Receipt...' : 'Add Receipt'}
                        </button>
                    </form>
                </motion.div>
                <a href="/admin/view-receipt" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default AddReceiptForm;
