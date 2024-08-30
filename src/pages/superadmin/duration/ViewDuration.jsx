import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Edit, Trash } from 'lucide-react';

import TableComponent from '../../../components/admin/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/superadmin/Header';

const ViewDuration = () => {
    const [durations, setDurations] = useState([]);
    const [filteredDurations, setFilteredDurations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDurationData();
    }, []);

    const fetchDurationData = async () => {
        try {
            const response = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/fetchDurationList');
            setDurations(response.data);
            setFilteredDurations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching student data:', error);
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Duration ID', accessor: 'durationID' },
        { header: 'Sport Name', accessor: 'sportName' },
        { header: 'Duration Name', accessor: 'durationName' },
        { header: 'Duration Description', accessor: 'durationDescription' },
        { header: 'Number Of Sessions', accessor: 'numberOfSessions' },
        { header: 'Price', accessor: 'price' },
    ];

    const handleFilter = (filterText) => {
        const lowercasedFilter = filterText.toLowerCase();
        const filteredData = durations.filter((item) =>
            columns.some((col) =>
                item[col.accessor].toString().toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredDurations(filteredData);
    };

    const handleSort = (column, direction) => {
        const sortedData = [...filteredDurations].sort((a, b) => {
            const aValue = a[column] || '';
            const bValue = b[column] || '';
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        setFilteredDurations(sortedData);
    };

    const renderActions = (duration) => (
        <div className="flex space-x-4">
            <Link to={`/superadmin/update-duration/${duration.durationID}`} className="text-blue-600 hover:text-blue-900">
                <Edit className="w-5 h-5" />
            </Link>
           
        </div>
    );

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="View Duration" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Duration List</h2>
                    </div>

                    <div className="mb-4">
                        <Link to={`/superadmin/add-duration`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            + Add Duration
                        </Link>
                    </div>
                    <TableComponent
                        columns={columns}
                        data={filteredDurations}
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

export default ViewDuration;