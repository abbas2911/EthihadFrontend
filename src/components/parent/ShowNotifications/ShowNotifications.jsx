import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence  } from 'framer-motion';
import { ChevronUp, ChevronDown, CircleX  } from 'lucide-react';
import Modal from 'react-modal';

// Make sure to set the app element for accessibility
Modal.setAppElement('#root');

const ShowNotifications = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        // Fetch upcoming events when the component mounts
        const fetchUpcomingEvents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/parent/getEvent', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const events = response.data;
                if (events.length > 0) {
                    events.sort((a, b) => new Date(a.eventStartDate) - new Date(b.eventStartDate));
                    setEvents(events);
                    setSelectedEvent(events[0]);
                    setShowNotification(true);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchUpcomingEvents();
    }, []);

    const handleClosePopup = () => {
        setPopupOpen(false);
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setPopupOpen(true);
    };

    const handleToggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            {showNotification && events.length > 0 && (
                <motion.div
                    className={"bg-gray-700 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center w-full">
                        <h1 className="text-lg font-semibold text-gray-100 flex-grow">Upcoming Events</h1>
                        <button onClick={handleToggleExpand} className="ml-2">
                            <motion.div
                                animate={{ rotate: expanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                            </motion.div>
                        </button>
                    </div>
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                className="w-full overflow-auto mt-5"
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ul className="list-none">
                                    {events.map((event) => (
                                        <li
                                            key={event.eventID}
                                            onClick={() => handleEventClick(event)}
                                            className="cursor-pointer p-2 hover:bg-gray-900 rounded-xl ml-2"
                                        >
                                            <p className="font-medium text-gray-100 ml-2">{event.eventName}</p>
                                            <p className="text-sm text-gray-300 ml-2">{new Date(event.eventStartDate).toLocaleDateString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
            <Modal
                isOpen={popupOpen}
                onRequestClose={handleClosePopup}
                className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-20"
                aria-labelledby="event-popup-title"
                aria-describedby="event-popup-description"
            >
                <motion.div
                    className="bg-gray-700 w-full max-w-xl mx-auto rounded-lg shadow-lg relative p-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <button
                        onClick={handleClosePopup}
                        className="absolute top-4 right-4 text-gray-100"
                        aria-label="close"
                    >
                        <CircleX size={24} />
                    </button>
                    {selectedEvent && (
                        <>
                            <h2 id="event-popup-title" className="text-xl font-bold text-gray-100 mb-3">
                                {selectedEvent.eventName}
                            </h2>
                            <p id="event-popup-description" className="mt-2 text-gray-300 text-sm mb-4 font-semibold">
                                {selectedEvent.eventDescription}
                            </p>
                            <p className="mt-2 text-gray-300 text-sm font-semibold">Start Date: {new Date(selectedEvent.eventStartDate).toLocaleDateString()}</p>
                            <p className="mt-1 text-gray-300 text-sm font-semibold">End Date: {new Date(selectedEvent.eventEndDate).toLocaleDateString()}</p>
                        </>
                    )}
                </motion.div>
            </Modal>
        </>
    );
};

export default ShowNotifications;
