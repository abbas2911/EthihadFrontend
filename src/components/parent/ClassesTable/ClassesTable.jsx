import { motion } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { TermContext } from '../../../context/TermContext';

const ClassesTable = () => {
    const [classes, setClasses] = useState([]);
    const { termName } = useContext(TermContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParentData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // Fetch parent class
                    const responseClasses = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/parent/fetchParentClass', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setClasses(responseClasses.data);
                }
            } catch (error) {
                console.error('Error fetching parent data:', error);
                setError('Error fetching parent data');
            } finally {
                setLoading(true);
            }
        };

        fetchParentData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1100); // 2 seconds delay

        // Cleanup timeout if the component unmounts before the timer finishes
        return () => clearTimeout(timer);
    }, []);

    if (loading) return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8 animate-pulse"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="mb-6">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                <div className="mt-6">
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                </div>
            </div>
        </motion.div>
    );

    if (error) return <p>{error}</p>;

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <div className="mb-6">
                {termName ? (
                    <>
                        <h2 className="text-xl font-semibold text-gray-100">Class List</h2>
                        <p className="text-xs mt-1 text-gray-400">You are in the Term: {termName}</p>
                    </>
                ) : (
                    <p className="text-xs text-gray-100">Loading Term Information...</p>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">First Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Class Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Class Days</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Class Timings</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700">
                        {classes.map(classItem => (
                            <motion.tr
                                key={`${classItem.studentID}-${classItem.classID}-${classItem.sportID}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{classItem.firstName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{classItem.studentID}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{classItem.className}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{classItem.days}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{classItem.timing}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                <div className="text-sm mt-2 text-red-400 space-y-2">
                    <p>
                        <strong>Note:</strong> The class list shows potential classes your child(ren) might attend. 
                        If your child does not appear here, it means there are no classes available for them with the selected sport.
                    </p>
                    <p>
                        Please note that students are not considered fully enrolled in a class until they are marked as active. 
                        You can view their active status below.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default ClassesTable;