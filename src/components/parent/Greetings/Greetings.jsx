import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';

const Greetings = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const getUsername = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    setUsername(decodedToken.username);
                }
            } catch (error) {
                console.error('Error fetching parent username:', error);
            }
        };
        getUsername();
    }, []);

  return (
    <motion.div
        className="bg-gray-700 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
    >
        <div>
            <h1 className="text-2xl font-bold text-gray-100 space-y-2">Hi, {username}! Welcome To Your Dashboard!</h1>
        </div>

    </motion.div>
  )
}
export default Greetings