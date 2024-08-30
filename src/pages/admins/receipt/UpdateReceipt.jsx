import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../../../components/common/admins/Header';

const UpdateReceipt = () => {
    const { receiptID } = useParams();
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);
    const [formData, setFormData] = useState({
        invoiceID: '',
        paymentDate: '',
        paymentMode: '',
        amount: '',
        status: '',
        description: ''
    });
    const [invoiceIDs, setInvoiceIDs] = useState([]);

    useEffect(() => {
        fetchReceiptDetails();
        fetchInvoiceIDs();
    }, []);

    const fetchReceiptDetails = async () => {
        try {
            const response = await axios.get(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/read-receipt/${receiptID}`);
            
            // Format the date to yyyy-mm-dd
            const formatDate = (dateStr) => {
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) {
                    console.error('Invalid date:', dateStr);
                    return ''; // Fallback to an empty string if parsing fails
                }
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            setFormData({
                invoiceID: response.data.invoiceID || '',
                paymentDate: formatDate(response.data.paymentDate) || '',
                paymentMode: response.data.paymentMode || '',
                amount: response.data.amount || '',
                status: response.data.status || '',
                description: response.data.description || ''
            });
        } catch (error) {
            console.error('Error fetching receipt details:', error);
        }
    };

    const fetchInvoiceIDs = async () => {
        try {
            const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/getInvoiceIDs');
            setInvoiceIDs(response.data);
        } catch (error) {
            console.error('Error fetching invoice IDs:', error);
        }
    };

    const fetchInvoiceAmount = async (invoiceID) => {
        try {
            const response = await axios.get(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/getInvoiceAmount/${invoiceID}`);
            setFormData((prevFormData) => ({
                ...prevFormData,
                amount: response.data.amount,
            }));
        } catch (error) {
            console.error('Error fetching invoice amount:', error);
        }
    };

    const handleInvoiceChange = (e) => {
        const selectedInvoiceID = e.target.value;
        setFormData({
            ...formData,
            invoiceID: selectedInvoiceID,
        });
        fetchInvoiceAmount(selectedInvoiceID);
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
            await axios.put(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/updateReceipt/${receiptID}`, formData);

            setAlertMessage('Successfully Updated Receipt');
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            console.error('Error updating receipt:', error);
            setAlertMessage('Failed to update receipt');
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
            <Header title="Update Receipt" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Update Receipt Form</h2>
                        <p className="text-xs mt-1 text-gray-400">Update the fields you want to change</p>
                        <p className='text-sm mt-1 text-red-400'>
                            <strong>Note: </strong> 
                                Changing the Invoice ID requires updating the 
                                remaining and grace sessions for both the current and new students associated with the invoice.
                            <a href="/admin/view-student/" className="text-blue-500 underline hover:text-blue-700">
                                Click here
                            </a> to go to Update Sport.
                        </p>

                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Invoice ID Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">
                                Invoice ID
                            </label>
                            <select
                                name="invoiceID"
                                value={formData.invoiceID}
                                onChange={handleInvoiceChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                required
                            >
                                <option value="">Select Invoice ID</option>
                                {invoiceIDs.map((invoice) => (
                                    <option key={invoice.invoiceID} value={invoice.invoiceID}>
                                        {invoice.invoiceID}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Payment Date Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-100">
                                Payment Date
                            </label>
                            <input
                                type="date"
                                name="paymentDate"
                                value={formData.paymentDate}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        {/* Payment Mode Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-100">
                                Payment Mode
                            </label>
                            <input
                                type="text"
                                name="paymentMode"
                                value={formData.paymentMode}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        {/* Amount Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-100">
                                Amount
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        {/* Status Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-100">
                                Status
                            </label>
                            <input
                                type="text"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        {/* Description Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-100">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Update Receipt
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

export default UpdateReceipt;
