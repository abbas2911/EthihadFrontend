import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../../components/common/admins/Header';
import Greetings from '../../../components/admin/Greetings/Greetings';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalCoaches: 0,
    totalStudents: 0,
    activeStudents: 0,
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/fetchLogs');
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    const fetchAttendance = async () => {
      try {
        const response = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/fetchAttendance');
        setAttendances(response.data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    const fetchStatistics = async () => {
      try {
        const classCoachResponse = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/statistics');
        const studentResponse = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/getStudentStats');

        setStats({
          totalClasses: classCoachResponse.data.totalClasses,
          totalCoaches: classCoachResponse.data.totalCoaches,
          totalStudents: studentResponse.data.totalStudents,
          activeStudents: studentResponse.data.activeStudents,
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchLogs();
    fetchAttendance();
    fetchStatistics();
  }, []);

  const handleAddInvoiceClick = () => navigate('/admin/add-invoice');
  const handleAddReceiptClick = () => navigate('/admin/add-receipt');
  const handleAddStudentClick = () => navigate('/admin/add-student');

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Dashboard" />

      <main className="max-w-7xl mx-auto py-10 px-6 lg:px-8">
        <Greetings />

        {/* Statistics Section */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 mb-8"
          whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-6">Class & Student Statistics</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatisticCard label="Total Classes" value={stats.totalClasses} />
              <StatisticCard label="Total Coaches" value={stats.totalCoaches} />
              <StatisticCard label="Total Students" value={stats.totalStudents} />
              <StatisticCard label="Active Students" value={stats.activeStudents} />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 mb-8"
          whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-6">Quick Actions</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ActionButton label="Add Invoice" onClick={handleAddInvoiceClick} />
              <ActionButton label="Add Receipt" onClick={handleAddReceiptClick} />
              <ActionButton label="Add Student" onClick={handleAddStudentClick} />
            </div>
          </div>
        </motion.div>

        {/* Logs Section */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 mb-8"
          whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-6">Logs</h3>
            <div className="max-h-80 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {logs.map((log, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{log.action}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{log.username}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Attendance Section */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 mb-8"
          whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-6">Attendance</h3>
            <div className="max-h-80 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Attendance ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Class Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {attendances.map((attendance, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{attendance.attendenceID}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{attendance.studentFullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{attendance.className}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{attendance.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

// Reusable ActionButton component
const ActionButton = ({ label, onClick }) => (
  <motion.button
    onClick={onClick}
    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-md shadow-md focus:outline-none"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 15 }}
  >
    {label}
  </motion.button>
);

// Reusable StatisticCard component for individual statistics
const StatisticCard = ({ label, value }) => (
  <motion.div
    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-4 px-6 rounded-md shadow-md"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 15 }}
  >
    <p className="text-xl">{value}</p>
    <p className="text-sm text-gray-300">{label}</p>
  </motion.div>
);

export default AdminDashboard;
