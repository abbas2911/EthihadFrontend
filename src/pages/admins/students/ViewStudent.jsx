import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Eye, Edit, LoaderPinwheel } from 'lucide-react';

import TableComponent from '../../../components/admin/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/admins/Header';

const ViewStudent = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            const response = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/view-students');
            const transformedStudents = response.data.map(student => ({
                ...student,
                active: student.active === 1 ? 'Yes' : 'No'
            }));
            setStudents(transformedStudents);
            setFilteredStudents(transformedStudents);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching student data:', error);
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Student ID', accessor: 'studentID' },
        { header: 'Full Name', accessor: 'fullName' },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Age Category', accessor: 'ageCategoryName' },
        { header: 'Medical Conditions', accessor: 'medical_conditions' },
        { header: 'Type', accessor: 'type' },
        { header: 'Active', accessor: 'active' },  // This will now show 'Yes' or 'No'
        { header: 'Academy Location', accessor: 'locationName' },
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

    const renderActions = (student) => (
        <div className="flex space-x-4">
            <Link to={`/admin/read-student/${student.studentID}`} className="text-blue-600 hover:text-blue-900">
                <Eye className="w-5 h-5" />
            </Link>
            <Link to={`/admin/update-student/${student.studentID}`} className="text-blue-600 hover:text-blue-900">
                <Edit className="w-5 h-5" />
            </Link>
            <Link to={`/admin/update-sport/${student.studentID}`} className="text-blue-600 hover:text-blue-900">
                <LoaderPinwheel className="w-5 h-5" />
            </Link>
        </div>
    );

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="View Students" />
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

                    <div className="mb-4">
                        <Link to={`/admin/add-student`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            + Add Student
                        </Link>
                    </div>
                    <TableComponent
                        columns={columns}
                        data={filteredStudents}
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

export default ViewStudent;
