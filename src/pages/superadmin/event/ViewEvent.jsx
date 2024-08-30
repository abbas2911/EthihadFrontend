import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash } from 'lucide-react';

import TableComponent from '../../../components/admin/ViewTableComponent/ViewTableComponents';
import Header from '../../../components/common/admins/Header';

const ViewEvent = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEventData();
    }, []);

    const fetchEventData = async () => {
        try {
            const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/fetchEventList');
    
            // Format the dates to yyyy-mm-dd
            const formatDate = (dateStr) => {
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) {
                    console.error('Invalid date:', dateStr);
                    return ''; // Fallback to an empty string if parsing fails
                }
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
    
            const formattedData = response.data.map(event => ({
                ...event,
                eventStartDate: formatDate(event.eventStartDate),
                eventEndDate: formatDate(event.eventEndDate),
                notificationStartDate: formatDate(event.notificationStartDate),
                notificationEndDate: formatDate(event.notificationEndDate),
            }));
    
            setEvents(formattedData);
            setFilteredEvents(formattedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching event data:', error);
            setLoading(false);
        }
    };
    

    const columns = [
        { header: 'Event ID', accessor: 'eventID' },
        { header: 'Event Name', accessor: 'eventName' },
        { header: 'Event Start Date', accessor: 'eventStartDate' },
        { header: 'Event End Date', accessor: 'eventEndDate' },
        { header: 'Notification Start Date', accessor: 'notificationStartDate' },
        { header: 'Notification End Date', accessor: 'notificationEndDate' },
    ];

    const handleFilter = (filterText) => {
        const lowercasedFilter = filterText.toLowerCase();
        const filteredData = events.filter((item) =>
            columns.some((col) =>
                item[col.accessor].toString().toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredEventst(filteredData);
    };

    const handleSort = (column, direction) => {
        const sortedData = [...filteredStudents].sort((a, b) => {
            const aValue = a[column] || '';
            const bValue = b[column] || '';
            return direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
        setFilteredEvents(sortedData);
    };

    const renderActions = (event) => (
        <div className="flex space-x-4">
            <Link to={`/superadmin/read-event/${event.eventID}`} className="text-blue-600 hover:text-blue-900">
                <Eye className="w-5 h-5" />
            </Link>
            <Link to={`/superadmin/update-event/${event.eventID}`} className="text-blue-600 hover:text-blue-900">
                <Edit className="w-5 h-5" />
            </Link>
            <Link to={`/superadmin/delete-event/${event.eventID}`} className="text-red-600 hover:text-red-900">
                <Trash className="w-5 h-5" />
            </Link>
        </div>
    );

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="View Events" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Event List</h2>
                    </div>

                    <div className="mb-4">
                        <Link to={`/superadmin/add-event`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            + Add Event
                        </Link>
                    </div>
                    <TableComponent
                        columns={columns}
                        data={filteredEvents}
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

export default ViewEvent;