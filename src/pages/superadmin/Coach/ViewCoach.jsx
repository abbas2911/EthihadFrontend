import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash } from 'lucide-react';

import TableComponent from '../../../components/admin/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/superadmin/Header';

const ViewCoach = () => {
    const [coaches, setCoaches] = useState([]);
    const [filteredCoaches, setFilteredCoaches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoachData();
    }, []);

    const fetchCoachData = async () => {
        try {
            const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/view-coaches'); // Ensure this endpoint exists
            const transformedCoaches = response.data.map(coach => ({
                ...coach,
                phone: coach.phone || 'N/A'
            }));
            setCoaches(transformedCoaches);
            setFilteredCoaches(transformedCoaches);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching coach data:', error);
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Coach ID', accessor: 'coachID' },
        { header: 'Full Name', accessor: 'fullName' },
        { header: 'Email', accessor: 'email' },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Type', accessor: 'type' }
    ];

    const handleFilter = (filterText) => {
        const lowercasedFilter = filterText.toLowerCase();
        const filteredData = coaches.filter((item) =>
            columns.some((col) =>
                item[col.accessor].toString().toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredCoaches(filteredData);
    };

    const handleSort = (column, direction) => {
        const sortedData = [...filteredCoaches].sort((a, b) => {
            const aValue = a[column] || '';
            const bValue = b[column] || '';
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        setFilteredCoaches(sortedData);
    };

    const renderActions = (coach) => (
        <div className="flex space-x-4">
            <Link to={`/superadmin/read-coach/${coach.coachID}`} className="text-blue-600 hover:text-blue-900">
                <Eye className="w-5 h-5" />
            </Link>
            <Link to={`/superadmin/update-coach/${coach.coachID}`} className="text-blue-600 hover:text-blue-900">
                <Edit className="w-5 h-5" />
            </Link>
            <Link to={`/superadmin/delete-coach/${coach.coachID}`} className="text-red-600 hover:text-red-900">
                <Trash className="w-5 h-5" />
            </Link>
        </div>
    );

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="View Coaches" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Coach List</h2>
                    </div>

                    <div className="mb-4">
                        <Link to={`/superadmin/add-coach`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            + Add Coach
                        </Link>
                    </div>
                    <TableComponent
                        columns={columns}
                        data={filteredCoaches}
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

export default ViewCoach;
