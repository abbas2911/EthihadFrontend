import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Grades = () => {
    const [grades, setGrades] = useState([]);
    const [error, setError] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState('');

    const fetchGrades = async (week = '') => {
        if (!week) return;
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/parent/fetchParentGrades/${week}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.msg) {
                    setGrades([]);
                    setError(response.data.msg);
                } else {
                    setGrades(response.data);
                    setError(null);
                }
            }
        } catch (err) {
            setGrades([]);
            setError('Error fetching grades');
            console.error(err);
        }
    };

    useEffect(() => { 
        fetchGrades(selectedWeek);
    }, [selectedWeek]);

    const handleWeekChange = (event) => {
        const week = event.target.value;
        setSelectedWeek(week);
    };

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Grades</h2>
                <p className="text-xs mt-1 text-gray-400">Select a week to show grades.</p>
            </div>

            <div className="mb-4">
                <label htmlFor="week" className="block text-sm font-medium text-gray-100">
                    Week
                </label>
                <select
                    id="week"
                    value={selectedWeek}
                    onChange={handleWeekChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="None"></option>
                    {[...Array(15).keys()].map(week => (
                        <option key={week + 1} value={week + 1}>
                            Week {week + 1}
                        </option>
                    ))}
                </select>
                {error && <p className="text-xs mt-1 text-red-200">{error}</p>}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Class</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Week</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Grade</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map(grade => (
                            <tr key={grade.gradebookID}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{`${grade.firstName} ${grade.lastName}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{grade.className}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{grade.week}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{grade.grade}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{grade.comment}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {grades.length === 0 && !error && (
                    <p className="text-gray-100 text-center mt-4">
                        No week is selected.
                    </p>
                )}
            </div>
        </motion.div>
    );
};

export default Grades;