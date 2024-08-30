import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import TableComponent from '../../../components/admin/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/admins/Header';
import { useParams } from 'react-router-dom';

const ViewInjuryReports = ({ parentID }) => {
    const [injuryReports, setInjuryReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        if (parentID) {
            console.log('parentID:', parentID);
            fetchInjuryReportsData();
        } else {
            console.error('parentID is not defined');
        }
    }, [parentID]); // Make sure to pass parentID as a dependency
    // Make sure to pass parentID as a dependency
    
    const fetchInjuryReportsData = async () => {
        try {
            const response = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/parent/getInjury/${parentID}`);
            setInjuryReports(response.data);
            setFilteredReports(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching injury reports data:', error);
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
                typeof col.accessor === 'function'
                    ? col.accessor(item).toString().toLowerCase().includes(lowercasedFilter)
                    : item[col.accessor].toString().toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredReports(filteredData);
    };

    const handleSort = (column, direction) => {
        const sortedData = [...filteredReports].sort((a, b) => {
            const aValue = typeof column.accessor === 'function' ? column.accessor(a) : a[column.accessor];
            const bValue = typeof column.accessor === 'function' ? column.accessor(b) : b[column.accessor];
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
