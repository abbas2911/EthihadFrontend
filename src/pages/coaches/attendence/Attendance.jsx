import React, { useState, useEffect } from "react";
import axios from 'axios';
import Header from "../../../components/common/coaches/Header";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

const Attendance = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchCoachClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/coach/fetchCoachClass', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setClasses(response.data);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchCoachClasses();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Attendance" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="overflow-x-auto">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-100">Attendance Class List</h2>
              <p className="text-xs mt-1 text-gray-400">Pick a class to mark attendance</p>
            </div>
            {classes.length > 0 ? (
              <ul className="space-y-6">
                {classes.map((classItem) => (
                  <li key={classItem.classID} className="flex flex-col items-start p-4 border rounded-lg shadow-sm bg-gray-700 space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
                    <div>
                      <span className="font-medium text-gray-100">{classItem.className}</span> - {classItem.days} at {classItem.timing}
                    </div>
                    <Link to={`/coach/mark-attendance/${classItem.classID}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300">
                      Mark Attendance
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No classes found.</p>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Attendance;