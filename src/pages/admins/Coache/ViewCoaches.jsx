import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import TableComponent from '../../../components/admin/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/admins/Header';

const ViewAttendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const fetchAttendanceData = async () => {
        try {
            const response = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/view-coaches');
            setAttendanceRecords(response.data);
            setFilteredRecords(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Attendance ID', accessor: 'attendanceID' },
        { header: 'Coach ID', accessor: 'coachID' },
        { header: 'Full Name', accessor: 'fullName' },
        { header: 'Type', accessor: 'type' },
        { header: 'Location', accessor: 'locationName' },
        { header: 'Date', accessor: 'attendanceDate' },
        { header: 'Status', accessor: 'status' }
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Formats date to yyyy-mm-dd
    };

    const handleFilter = (filterText) => {
        const lowercasedFilter = filterText.toLowerCase();
        const filteredData = attendanceRecords.filter((item) =>
            columns.some((col) =>
                item[col.accessor]?.toString().toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredRecords(filteredData);
    };

    const handleSort = (column, direction) => {
        const sortedData = [...filteredRecords].sort((a, b) => {
            const aValue = a[column] || '';
            const bValue = b[column] || '';
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        setFilteredRecords(sortedData);
    };

    const formattedRecords = filteredRecords.map(record => ({
        ...record,
        attendanceDate: formatDate(record.attendanceDate),
    }));

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="View Attendance" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Attendance Records</h2>
                    </div>

                    <div className="mb-4">
                        <div className="mb-4">
                            <Link to={`/admin/add-attendance`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                + Add Attendance
                            </Link>
                        </div>
                    </div>

                    <TableComponent
                        columns={columns}
                        data={formattedRecords}
                        loading={loading}
                        onFilter={handleFilter}
                        onSort={handleSort}
                    />
                </motion.div>
            </main>
        </div>
    );
};

export default ViewAttendance;
