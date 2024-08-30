import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const LedgerChart = ({ data }) => {
  // Prepare chart data from ledgerData
  const chartData = Object.keys(data).map((locationID) => ({
    name: data[locationID].locationName,
    expected: data[locationID].total_expected,
    received: data[locationID].total_received,
  }));

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className='text-lg font-medium mb-4 text-gray-100'>Ledger Overview</h2>

      <div className='h-80'>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend
              wrapperStyle={{ bottom: 0, left: '50%', transform: 'translateX(-50%)' }}
              iconType="square"
            />
            <Bar
              dataKey="expected"
              fill="#6366F1"
              stackId="a"
              onMouseEnter={(e) => e.target.style.fill = '#4B5DFF'}
              onMouseLeave={(e) => e.target.style.fill = '#6366F1'}
            />
            <Bar
              dataKey="received"
              fill="#10B981"
              stackId="a"
              onMouseEnter={(e) => e.target.style.fill = '#059669'}
              onMouseLeave={(e) => e.target.style.fill = '#10B981'}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default LedgerChart;