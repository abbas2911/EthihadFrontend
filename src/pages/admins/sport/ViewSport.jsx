import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {  Edit } from 'lucide-react';

import TableComponent from '../../../components/admin/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/admins/Header';

const ViewSport = () => {
    const [sports, setSports] = useState([]);
    const [filteredSports, setFilteredSports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSportData();
    }, []);

    const fetchSportData = async () => {
        try {
            const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/fetchSportList');
            setSports(response.data);
            setFilteredSports(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sport data:', error);
            setLoading(false);
        }
    };
    
    

    const columns = [
        { header: 'Sport ID', accessor: 'sportID' },
        { header: 'Sport Name', accessor: 'sport_name' },
    ];

    const handleFilter = (filterText) => {
        const lowercasedFilter = filterText.toLowerCase();
        const filteredData = sports.filter((item) =>
            columns.some((col) =>
                item[col.accessor].toString().toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredSports(filteredData);
    };

    const handleSort = (column, direction) => {
        const sortedData = [...filteredSports].sort((a, b) => {
            const aValue = a[column] || '';
            const bValue = b[column] || '';
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        filteredSports(sortedData);
    };

    const renderActions = (sport) => (
        <div className="flex space-x-4">
            <Link to={`/admin/update-sport/${sport.sportID}`} className="text-blue-600 hover:text-blue-900">
                <Edit className="w-5 h-5" />
            </Link>
            
        </div>
    );

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="View Sports" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Sport List</h2>
                    </div>

                    <div className="flex justify-between mb-4">
                        <Link to={`/admin/add-sport`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            + Add Sport
                        </Link>
                    </div>
    
                    <TableComponent
                        columns={columns}
                        data={filteredSports}
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

export default ViewSport;