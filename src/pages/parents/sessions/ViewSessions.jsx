import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

import TableComponent from '../../../components/parent/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/parents/Header';

const ViewSessions = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/parent/view-sessions', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setStudents(response.data);
            setFilteredStudents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching student data:', error);
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Student Name', accessor: 'studentFullName' },
        { header: 'Sport Name', accessor: 'sport_name' },
        { header: 'Remaining Sessions', accessor: 'remaining_sessions' },
        { header: 'Grace Sessions', accessor: 'grace_sessions' },
    ];

    const handleFilter = (filterText) => {
        const lowercasedFilter = filterText.toLowerCase();
        const filteredData = students.filter((item) =>
            columns.some((col) =>
                item[col.accessor].toString().toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredStudents(filteredData);
    };

    const handleSort = (column, direction) => {
        const sortedData = [...filteredStudents].sort((a, b) => {
            const aValue = a[column] || '';
            const bValue = b[column] || '';
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        setFilteredStudents(sortedData);
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="View Sessions" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Student List</h2>
                    </div>

                    <TableComponent
                        columns={columns}
                        data={filteredStudents}
                        loading={loading}
                        onFilter={handleFilter}
                        onSort={handleSort}
                    />
                </motion.div>
            </main>
        </div>
    );
};

export default ViewSessions;