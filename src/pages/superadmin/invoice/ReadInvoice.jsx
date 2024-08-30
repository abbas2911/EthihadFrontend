import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../../../components/common/admins/Header';

const ReadInvoice = () => {
    const { invoiceID } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                const response = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/readInvoice/${invoiceID}`);
                if (response.data) {
                    setInvoice(response.data);
                } else {
                    setInvoice(null);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching invoice data:', error);
                setLoading(false);
            }
        };

        fetchInvoiceData();
    }, [invoiceID]);

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Read Invoice" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    {loading ? (
                        <p className="text-white">Loading...</p>
                    ) : invoice ? (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-100">Invoice #{invoice.invoiceID}</h2>
                            <p className="text-gray-400">Invoice ID: {invoice.invoiceID}</p>
                            <p className="text-gray-400">Student Name: {invoice.studentName}</p>
                            <p className="text-gray-400">Grand Amount (AED): {invoice.grand_amount}</p>
                            <p className="text-gray-400">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                            <p className="text-gray-400">Paid: {invoice.paid === 1 ? 'Yes' : 'No'}</p>

                            {invoice.durations.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-200">Duration Items</h3>
                                    {invoice.durations.map((duration, index) => (
                                        <div key={index} className="text-gray-400">
                                            <p>Duration ID: {duration.durationID}</p>
                                            <p>Duration Name: {duration.durationName}</p>
                                            <p>Rate Per: {duration.rate_per}</p>
                                            <p>Quantity: {duration.quantity}</p>
                                            <p>Total Amount: {duration.total_amount}</p>
                                            <hr className="my-2" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {invoice.items.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-200">Items</h3>
                                    {invoice.items.map((item, index) => (
                                        <div key={index} className="text-gray-400">
                                            <p>Item Name: {item.itemName}</p>
                                            <p>Rate Per: {item.rate_per}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Total Amount: {item.total_amount}</p>
                                            <hr className="my-2" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-red-500">Invoice not found</p>
                    )}
                </motion.div>
                <a href="/superadmin/view-invoice" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
            </main>
        </div>
    );
};

export default ReadInvoice;
