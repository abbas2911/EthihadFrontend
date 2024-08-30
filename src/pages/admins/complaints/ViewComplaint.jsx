import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trash } from 'lucide-react';

import TableComponent from '../../../components/admin/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/admins/Header';

const ViewComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        fetchComplaintsData();
    }, []);

    const fetchComplaintsData = async () => {
        try {
            const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/getcomplaints');
            setComplaints(response.data);
            setFilteredComplaints(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching complaints data:', error);
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Complaint ID', accessor: 'complaintID' },
        { header: 'Parent Name', accessor: 'parentName' },
        { header: 'Student Name', accessor: 'studentName' },
        { header: 'Complaint Message', accessor: 'complaintMessage' },
        { header: 'Status', accessor: 'status' },
        { header: 'Date Submitted', accessor: 'createdAt' },
    ];

    const handleFilter = (filterText) => {
        const lowercasedFilter = filterText.toLowerCase();
        const filteredData = complaints.filter((item) =>
            columns.some((col) =>
                typeof col.accessor === 'function'
                    ? col.accessor(item).toString().toLowerCase().includes(lowercasedFilter)
                    : item[col.accessor].toString().toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredComplaints(filteredData);
    };

    const handleSort = (column, direction) => {
        const sortedData = [...filteredComplaints].sort((a, b) => {
            const aValue = typeof column.accessor === 'function' ? column.accessor(a) : a[column.accessor];
            const bValue = typeof column.accessor === 'function' ? column.accessor(b) : b[column.accessor];
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        setFilteredComplaints(sortedData);
    };

    const handleDelete = async (complaintID) => {
        try {
            await axios.delete(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/deleteComplaint/${complaintID}`);
            setComplaints(complaints.filter(complaint => complaint.complaintID !== complaintID));
            setFilteredComplaints(filteredComplaints.filter(complaint => complaint.complaintID !== complaintID));
            setAlertMessage('Complaint deleted successfully');
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            console.error('Error deleting complaint:', error);
            setAlertMessage('Error deleting complaint');
            setAlertSeverity('error');
            setOpenAlert(true);
        }
    };

    const renderActions = (complaint) => (
        <div className="flex space-x-4">
            <button
                onClick={() => handleDelete(complaint.complaintID)}
                className="text-red-600 hover:text-red-900"
            >
                <Trash className="w-5 h-5" />
            </button>
        </div>
    );

    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="View Complaints" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Complaints List</h2>
                    </div>

                    <TableComponent
                        columns={columns}
                        data={Array.isArray(filteredComplaints) ? filteredComplaints : []}
                        loading={loading}
                        renderActions={renderActions}
                        onFilter={handleFilter}
                        onSort={handleSort}
                    />
                </motion.div>
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

export default ViewComplaints;
