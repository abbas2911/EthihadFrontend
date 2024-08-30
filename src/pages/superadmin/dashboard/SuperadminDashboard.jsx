import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../../components/common/superadmin/Header';
import Greetings from '../../../components/Superadmin/Greetings/Greetings';
import axios from 'axios';
import LedgerChart from '../../../components/Superadmin/LedgerChart/LedgerChart';

const SuperadminDashboard = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalCoaches: 0,
    totalStudents: 0,
    activeStudents: 0,
  });
  const [ledgerData, setLedgerData] = useState({});
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/fetchLogs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const classCoachResponse = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/statistics');
      const studentResponse = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/getStudentStats');

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

  const fetchLedger = useCallback(async (customMonth = month, customYear = year) => {
    setLoading(true);
    try {
      const response = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/fetchLedger', {
        params: {
          month: customMonth,
          year: customYear,
        },
      });
      setLedgerData(response.data);
    } catch (error) {
      console.error('Error fetching ledger:', error);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchLogs();
    fetchStatistics();
 
  }, [fetchLogs, fetchStatistics]);

  useEffect(() => {
    const fetchData=async () => {
      await fetchLedger();
    };
    fetchData();
  }, [fetchLedger]);

  const handleAddAdminClick = () => navigate('/superadmin/add-admin');
  const handleAddCoachClick = () => navigate('/superadmin/add-coach');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchLedger(month, year);
  };

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
              <ActionButton label="Add Admin" onClick={handleAddAdminClick} />
              <ActionButton label="Add Coach" onClick={handleAddCoachClick} />
            </div>
          </div>
        </motion.div>

        {/* Ledger Section */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 mb-8"
          whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-2xl font-bold text-gray-100 mb-6">Ledger Overview</h3>

            <form onSubmit={handleSubmit} className="space-y-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-white font-medium">Month:</label>
                  <input
                    type="number"
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    min="1"
                    max="12"
                    className="mt-2 p-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-white font-medium">Year:</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    min="1900"
                    max="2100"
                    className="mt-2 p-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Fetch Ledger
              </button>
            </form>

            {loading ? (
              <p className="text-center text-white text-lg mt-4">Loading...</p>
            ) : (
              <div className="mt-8">
                <h4 className="text-xl text-white font-semibold mb-4">
                  Ledger for {month}/{year}
                </h4>
                <ul className="space-y-4">
                  {Object.keys(ledgerData).map((locationID) => {
                    const location = ledgerData[locationID];
                    return (
                      <li key={locationID} className="bg-gray-900 p-6 rounded-lg shadow-md">
                        <strong className="text-lg text-white">{location.locationName}</strong>
                        <p className="text-gray-300 mt-2">
                          Total Expected: AED {location.total_expected.toFixed(2)}
                        </p>
                        <p className="text-gray-300">Total Received: AED {location.total_received.toFixed(2)}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Include the chart component */}
            <LedgerChart data={ledgerData} />
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

export default SuperadminDashboard;
