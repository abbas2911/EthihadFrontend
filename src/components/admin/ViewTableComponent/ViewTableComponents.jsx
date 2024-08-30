import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ViewTableComponents = ({ columns, data, loading, renderActions, onFilter, onSort }) => {
    const [filterText, setFilterText] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setFilterText(value);
        onFilter(value);
    };

    const handleSort = (column) => {
        const direction = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
        onSort(column, direction);
    };

    // Calculate paginated data
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Determine total pages
    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <div className="mb-4">
                <input
                    type="text"
                    value={filterText}
                    onChange={handleFilterChange}
                    placeholder="Search..."
                    className="px-4 py-2 rounded-xl bg-gray-700 text-gray-100 w-full"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort(col.accessor)}
                                >
                                    {col.header}
                                    {sortColumn === col.accessor && (
                                        <span className="ml-2">
                                            {sortDirection === 'asc' ? '▲' : '▼'}
                                        </span>
                                    )}
                                </th>
                            ))}
                            {renderActions && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                                    Action
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="text-center p-4">
                                    <div className="loader"></div>
                                </td>
                            </tr>
                        ) : (
                            currentData.map((row, rowIndex) => (
                                <motion.tr
                                    key={rowIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-xs text-gray-100">
                                            {row[col.accessor]}
                                        </td>
                                    ))}
                                    {renderActions && (
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-100">
                                            {renderActions(row)}
                                        </td>
                                    )}
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg"
                >
                    Previous
                </button>
                <span className="text-gray-100">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg"
                >
                    Next
                </button>
            </div>
        </motion.div>
    );
};

export default ViewTableComponents;
