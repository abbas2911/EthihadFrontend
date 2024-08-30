import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';

import TableComponent from '../../../components/admin/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/admins/Header';

const ViewItem = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItemData();
    }, []);

    const fetchItemData = async () => {
        try {
            const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/fetchItemList');
            setItems(response.data);
            setFilteredItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching item data:', error);
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Item ID', accessor: 'itemID' },
        { header: 'Item Name', accessor: 'itemName' },
        { header: 'Description', accessor: 'itemDescription' },
        { header: 'Price', accessor: 'price' },
    ];

    const handleFilter = (filterText) => {
        const lowercasedFilter = filterText.toLowerCase();
        const filteredData = items.filter((item) =>
            columns.some((col) =>
                item[col.accessor].toString().toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredItems(filteredData);
    };

    const handleSort = (column, direction) => {
        const sortedData = [...filteredItems].sort((a, b) => {
            const aValue = a[column] || '';
            const bValue = b[column] || '';
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        setFilteredItems(sortedData);
    };

    const renderActions = (item) => (
        <div className="flex space-x-4">
            <Link to={`/superadmin/update-item/${item.itemID}`} className="text-blue-600 hover:text-blue-900">
                <Edit className="w-5 h-5" />
            </Link>
        </div>
    );

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="View Items" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Item List</h2>
                    </div>

                    <div className="mb-4">
                        <Link to={`/superadmin/add-item`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            + Add Item
                        </Link>
                    </div>
                    <TableComponent
                        columns={columns}
                        data={filteredItems}
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

export default ViewItem;
