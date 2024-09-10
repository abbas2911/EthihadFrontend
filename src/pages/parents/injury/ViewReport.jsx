import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import TableComponent from '../../../components/admin/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/admins/Header';

const ViewInjuryReports = () => {
    const [injuryReports, setInjuryReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        fetchInjuryReportsData();
    }, []);

    const fetchInjuryReportsData = async () => {
        try {
            // Fetch injury reports directly from backend using parentID
            const response = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/parent/getInjury`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming JWT token is stored in localStorage
                },
            });

            setInjuryReports(response.data);
            setFilteredReports(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching injury reports data:', error);
            setAlertMessage('Failed to fetch injury reports.');
            setAlertSeverity('error');
            setOpenAlert(true);
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Injury ID', accessor: 'injuryID' },
        { header: 'Student Name', accessor: 'studentName' },
        { header: 'Admin Name', accessor: 'adminName' },
        { header: 'Report Message', accessor: 'reportMessage' },
        { header: 'Date Submitted', accessor: 'createdAt' },
    ];

    const handleFilter = (filterText) => {
        const lowercasedFilter = filterText.toLowerCase();
        const filteredData = injuryReports.filter((item) =>
            columns.some((col) =>
                typeof item[col.accessor] === 'string' &&
                item[col.accessor].toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredReports(filteredData);
    };

    const handleSort = (column, direction) => {
        const sortedData = [...filteredReports].sort((a, b) => {
            const aValue = typeof a[column.accessor] === 'string' ? a[column.accessor] : a[column.accessor].toString();
            const bValue = typeof b[column.accessor] === 'string' ? b[column.accessor] : b[column.accessor].toString();
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        setFilteredReports(sortedData);
    };

    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="View Injury Reports" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Injury Reports List</h2>
                    </div>

                    <TableComponent
                        columns={columns}
                        data={Array.isArray(filteredReports) ? filteredReports : []}
                        loading={loading}
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

export default ViewInjuryReports;