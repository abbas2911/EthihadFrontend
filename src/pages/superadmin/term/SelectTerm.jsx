import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../../../components/common/admins/Header';

const SelectTerm = () => {
    const [formData, setFormData] = useState({
        termID: '',
        termName: '',
    });

    const [terms, setTerms] = useState([]);
    const [selecedTerm, setSelectedTerm] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        // Fetch all terms
        axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/fetchTerm')
            .then(response => {
                setTerms(Array.isArray(response.data) ? response.data : []);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching terms:', error);
            });

        // Fetch the selected term
        axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/getSelectedTerm')
            .then(response => {
                setSelectedTerm(response.data);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    termID: response.data.selectedTermID,
                    termName: response.data.termName,
                }));
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching selected term:', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const selectedTerm = terms.find(term => term.termID === value);

        setFormData({
            ...formData,
            [name]: value,
            termName: selectedTerm ? selectedTerm.termName : ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/saveSelectedTerm', { termID: formData.termID })
            .then(response => {
                console.log('Term selected:', response.data);
                setAlertMessage('Term Successfully Selected');
                setAlertSeverity('success');
                setOpenAlert(true);
            })
            .catch(error => {
                console.error('Error saving selected term:', error);
                setAlertMessage('Failed to select Term');
                setAlertSeverity('error');
                setOpenAlert(true);
            });
    };

    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Select Term" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Select Term Form</h2>
                        <p className="text-xs mt-1 text-red-400">
                            <strong>Note:</strong> Selecting a term will affect the entire application.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="termID" className="text-gray-300">
                                Term:
                            </label>
                            <select
                                id="termID"
                                name="termID"
                                value={formData.termID}
                                onChange={handleChange}
                                required
                                className="bg-gray-700 text-gray-100 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Select Term</option>
                                {terms.map(term => (
                                    <option key={term.termID} value={term.termID}>
                                        {term.termName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Submit
                        </button>
                    </form>
                </motion.div>
                <a href="/superadmin/view-term" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
            </main>
            {openAlert && (
                <motion.div
                    className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg text-white ${alertSeverity === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    exit={{ opacity: 0, x: 100 }}
                >
                    <div className="flex items-center justify-between">
                        <span>{alertMessage}</span>
                        <button
                            type="button"
                            className="ml-4 text-white hover:text-gray-200"
                            onClick={handleCloseAlert}
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default SelectTerm;