import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../../../components/common/superadmin/Header'; // Adjust the path if needed

const ReadCoach = () => {
    const { coachID } = useParams();
    const [coach, setCoach] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/read-coach/${coachID}`)
            .then(response => {
                setCoach(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching coach details:", error);
                setLoading(false);
            });
    }, [coachID]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!coach) {
        return <div>Coach not found.</div>;
    }

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Read Coach" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Coach Information</h2>
                    </div>

                    <div className="text-gray-300 space-y-4">
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs'>
                            <p><strong>Username:</strong> {coach.username}</p>
                            <p><strong>First Name:</strong> {coach.firstName}</p>
                            <p><strong>Last Name:</strong> {coach.lastName}</p>
                            <p><strong>Email:</strong> {coach.email}</p>
                            <p><strong>Phone:</strong> {coach.phone}</p>
                            <p><strong>Type:</strong> {coach.type}</p>
                            <p><strong>Location ID:</strong> {coach.locationID}</p>
                            {/* Add any additional fields as needed */}
                        </div>
                    </div>
                </motion.div>
                <a href="/superadmin/view-coach" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
            </main>
        </div>
    );
};

export default ReadCoach;
