import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Eye, Edit } from 'lucide-react';

import TableComponent from '../../../components/admin/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/admins/Header';

const ViewClass = () => {
    const [classes, setClasses] = useState([]);
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classResponse, coachResponse] = await Promise.all([
                    axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/view-class'),
                    axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/fetchCoach')
                ]);

                setClasses(classResponse.data);
                setFilteredClasses(classResponse.data);
                setCoaches(coachResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getCoachName = (coachID) => {
        const coach = coaches.find(c => c.coachID === coachID);
        return coach ? coach.coachName : 'Unknown';
    };

    const columns = [
        { header: 'Class ID', accessor: 'classID' },
        { header: 'Class Name', accessor: 'className' },
        { header: 'Coach', accessor: 'coachID' }, // Changed to 'Coach'
        { header: 'Type', accessor: 'type' },
    ];

    const handleFilter = (filterText) => {
        const lowercasedFilter = filterText.toLowerCase();
        const filteredData = classes.filter((item) =>
            columns.some((col) =>
                item[col.accessor].toString().toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredClasses(filteredData);
    };

    const handleSort = (column, direction) => {
        const sortedData = [...filteredClasses].sort((a, b) => {
            const aValue = a[column] || '';
            const bValue = b[column] || '';
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        setFilteredClasses(sortedData);
    };

    const renderActions = (classItem) => (
        <div className="flex space-x-4">
            <Link to={`/admin/read-class/${classItem.classID}`} className="text-blue-600 hover:text-blue-900">
                <Eye className="w-5 h-5" />
            </Link>
            <Link to={`/admin/update-class/${classItem.classID}`} className="text-blue-600 hover:text-blue-900">
                <Edit className="w-5 h-5" />
            </Link>
        </div>
    );

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="View Class" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Class List</h2>
                    </div>

                    <div className="mb-4">
                        <Link to={`/admin/add-class`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            + Add Class
                        </Link>
                    </div>
                    <TableComponent
                        columns={columns}
                        data={filteredClasses.map(item => ({
                            ...item,
                            coachID: getCoachName(item.coachID) // Map coachID to coachName
                        }))}
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

export default ViewClass;
