import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {  Edit } from 'lucide-react';

import TableComponent from '../../../components/admin/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/admins/Header';

const ViewTerm = () => {
    const [terms, setTerms] = useState([]);
    const [filteredTerms, setFilteredTerms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTermData();
    }, []);

    const fetchTermData = async () => {
        try {
            const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/fetchTermList');
            
            // Format the dates to yyyy-mm-dd
            const formattedData = response.data.map(term => {
                const formatDate = (dateStr) => {
                    const date = new Date(dateStr);
                    if (isNaN(date.getTime())) {
                        console.error('Invalid date:', dateStr);
                        return dateStr; // Fallback to the original string if parsing fails
                    }
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };
                
                return {
                    ...term,
                    start_date: formatDate(term.start_date), // Ensure property names are correct
                    end_date: formatDate(term.end_date),
                };
            });
    
            setTerms(formattedData);
            setFilteredTerms(formattedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching term data:', error);
            setLoading(false);
        }
    };
    
    

    const columns = [
        { header: 'Term ID', accessor: 'termID' },
        { header: 'Term Name', accessor: 'termName' },
        { header: 'Start Date', accessor: 'start_date' },
        { header: 'End Date', accessor: 'end_date' },
    ];

    const handleFilter = (filterText) => {
        const lowercasedFilter = filterText.toLowerCase();
        const filteredData = terms.filter((item) =>
            columns.some((col) =>
                item[col.accessor].toString().toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredTerms(filteredData);
    };

    const handleSort = (column, direction) => {
        const sortedData = [...filteredTerms].sort((a, b) => {
            const aValue = a[column] || '';
            const bValue = b[column] || '';
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        setFilteredTerms(sortedData);
    };

    const renderActions = (term) => (
        <div className="flex space-x-4">
            <Link to={`/superadmin/update-term/${term.termID}`} className="text-blue-600 hover:text-blue-900">
                <Edit className="w-5 h-5" />
            </Link>
            
        </div>
    );

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="View Terms" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Term List</h2>
                    </div>
    
                    <div className="flex justify-between mb-4">
                        <Link to={`/superadmin/add-term`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            + Add Term
                        </Link>
                        <Link to={`/superadmin/select-term`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Select Term
                        </Link>
                    </div>
    
                    <TableComponent
                        columns={columns}
                        data={filteredTerms}
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

export default ViewTerm;