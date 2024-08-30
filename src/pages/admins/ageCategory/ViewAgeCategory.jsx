import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {  Edit } from 'lucide-react';

import TableComponent from '../../../components/admin/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/admins/Header';

const ViewAgeCategory = () => {
    const [agecategorys, setAgeCategorys] = useState([]);
    const [filteredAgeCategorys, setFilteredAgeCategorys] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAgeCategoryData();
    }, []);

    const fetchAgeCategoryData = async () => {
        try {
            const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/fetchAgeCategoryList');
            setAgeCategorys(response.data);
            setFilteredAgeCategorys(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching age category data:', error);
            setLoading(false);
        }
    };
    
    

    const columns = [
        { header: 'Age Category ID', accessor: 'ageCategoryID' },
        { header: 'Category Name', accessor: 'categoryName' },
        { header: 'Type', accessor: 'type' },
    ];

    const handleFilter = (filterText) => {
        const lowercasedFilter = filterText.toLowerCase();
        const filteredData = agecategorys.filter((item) =>
            columns.some((col) =>
                item[col.accessor].toString().toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredAgeCategorys(filteredData);
    };

    const handleSort = (column, direction) => {
        const sortedData = [...filteredAgeCategorys].sort((a, b) => {
            const aValue = a[column] || '';
            const bValue = b[column] || '';
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        filteredAgeCategorys(sortedData);
    };

    const renderActions = (agecategory) => (
        <div className="flex space-x-4">
            <Link to={`/admin/update-agecategory/${agecategory.ageCategoryID}`} className="text-blue-600 hover:text-blue-900">
                <Edit className="w-5 h-5" />
            </Link>
            
        </div>
    );

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="View Age Category" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Age Category List</h2>
                    </div>

                    <div className="flex justify-between mb-4">
                        <Link to={`/admin/add-agecategory`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            + Add Age Category
                        </Link>
                    </div>
    
                    <TableComponent
                        columns={columns}
                        data={filteredAgeCategorys}
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

export default ViewAgeCategory;