import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Eye, Edit, Clipboard, Trash } from 'lucide-react';

import TableComponent from '../../../components/admin/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/admins/Header';

const ViewInvoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoiceData();
    }, []);

    const fetchInvoiceData = async () => {
        try {
            const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/viewInvoices');
            
            // Format the dates to yyyy-mm-dd
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

            const formattedData = response.data.map(invoice => ({
                ...invoice,
                dueDate: formatDate(invoice.dueDate),
                paid: invoice.paid === 1 ? 'Yes' : 'No'  // Transform 'paid' to 'Yes' or 'No'
            }));

            setInvoices(formattedData);
            setFilteredInvoices(formattedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching invoice data:', error);
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Invoice ID', accessor: 'invoiceID' },
        { header: 'Student Name', accessor: 'studentName' },
        { header: 'Grand Amount (AED)', accessor: 'grand_amount' },
        { header: 'Due Date', accessor: 'dueDate' },
        { header: 'Paid', accessor: 'paid' },  // This will now show 'Yes' or 'No'
    ];

    const handleFilter = (filterText) => {
        const lowercasedFilter = filterText.toLowerCase();
        const filteredData = invoices.filter((item) =>
            columns.some((col) =>
                item[col.accessor].toString().toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredInvoices(filteredData);
    };

    const handleSort = (column, direction) => {
        const sortedData = [...filteredInvoices].sort((a, b) => {
            const aValue = a[column] || '';
            const bValue = b[column] || '';
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        setFilteredInvoices(sortedData);
    };

    const renderActions = (invoice) => (
        <div className="flex space-x-4">
            <Link to={`/admin/read-invoice/${invoice.invoiceID}`} className="text-blue-600 hover:text-blue-900">
                <Eye className="w-5 h-5" />
            </Link>
            <Link to={`/admin/pdf-invoice/${invoice.invoiceID}`} className="text-gray-100 hover:text-gray-600">
                <Clipboard className="w-5 h-5" />
            </Link>
            <Link to={`/admin/delete-invoice/${invoice.invoiceID}`} className="text-red-600 hover:text-red-900">
                <Trash className="w-5 h-5" />
            </Link>
        </div>
    );

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="View Invoice" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Invoice List</h2>
                    </div>

                    <div className="mb-4">
                        <Link to={`/admin/add-invoice`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            + Add Invoice
                        </Link>
                    </div>
                    <TableComponent
                        columns={columns}
                        data={filteredInvoices}
                        loading={loading}
                        renderActions={renderActions}
                        onFilter={handleFilter}
                        onSort={handleSort}
                    />
                </motion.div>
            </main>
        </div>
    );
};

export default ViewInvoice;
