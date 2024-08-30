import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from 'axios';

const ActiveStatus = () => {
    const [activeStatus, setActiveStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParentData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // Fetch parent active classes
                    const responseActiveStatus = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/parent/fetchActiveStatus', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setActiveStatus(responseActiveStatus.data);
                }
            } catch (error) {
                console.error('Error fetching parent data:', error);
                setError('Error fetching parent data');
            } finally {
                setLoading(false);
            }
        };

        fetchParentData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 mb-8'
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <div className='px-4 py-5 sm:p-6'>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-100">Student Active Status</h2>
                </div>
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
                    {activeStatus.map(student => (
                        <div key={student.studentID} className='bg-gray-900 rounded-lg p-4'>
                            <h3 className="text-sm font-semibold text-gray-100">{`${student.firstName} ${student.lastName}`}</h3>
                            <p className='mt-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Active: {student.active ? 'Yes' : 'No'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
    
};

export default ActiveStatus;
