import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../../../components/common/admins/Header';

const ReadEvent = () => {
    const { eventID } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/read-event/${eventID}`)
            .then(response => {
                setEvent(response.data);  // Directly set the event object
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching event details:", error);
                setLoading(false);
            });
    }, [eventID]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!event) {
        return <div>Event not found.</div>;
    }

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Read Event" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Full Event Information</h2>
                    </div>

                    <div className="text-gray-300 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-100 mb-3">Event Details</h3>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs'>
                            <p><strong>Event Name:</strong> {event.eventName}</p>
                            <p><strong>Description:</strong> {event.eventDescription}</p>
                            <p><strong>Event Start Date:</strong> {new Date(event.eventStartDate).toLocaleDateString()}</p>
                            <p><strong>Event End Date:</strong> {new Date(event.eventEndDate).toLocaleDateString()}</p>
                            <p><strong>Notification Start Date:</strong> {new Date(event.notificationStartDate).toLocaleDateString()}</p>
                            <p><strong>Notification End Date:</strong> {new Date(event.notificationEndDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </motion.div>
                <a href="/admin/view-event" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
            </main>
        </div>
    );
};

export default ReadEvent;
