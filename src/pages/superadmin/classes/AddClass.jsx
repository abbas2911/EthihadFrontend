import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/common/superadmin/Header';
import { motion } from 'framer-motion';

const AddClass = () => {
    const [formData, setFormData] = useState({
        classID: '',
        className: '',
        sportID: '',
        coachID: '',
        ageCategoryID: '',
        termID: '',
        days: '',
        timing: '',
        type: 'General',
        locationID: ''
    });

    const [sports, setSports] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [ageCategories, setAgeCategories] = useState([]);
    const [terms, setTerms] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/fetchSport')
            .then(response => setSports(response.data))
            .catch(error => console.error('Error fetching sports:', error));

        axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/fetchCoach')
            .then(response => setCoaches(response.data))
            .catch(error => console.error('Error fetching coaches:', error));

        axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/classAgeCategory')
            .then(response => setAgeCategories(response.data))
            .catch(error => console.error('Error fetching age categories:', error));

        axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/fetchTerm')
            .then(response => setTerms(response.data))
            .catch(error => console.error('Error fetching terms:', error));

        axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/fetchLocationID')
            .then(response => setLocations(response.data))
            .catch(error => console.error('Error fetching locations:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'radio' && !checked ? prevState[name] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            setLoading(false);
            return;
        }

        try {
            await axios.post('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/superadmin/add-class', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            setAlertMessage('Class added successfully');
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            console.error('Error adding class:', error);
            setAlertMessage('Failed to add class');
            setAlertSeverity('error');
            setOpenAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Add Class" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Add Class Form</h2>
                        <p className="text-xs mt-1 text-gray-400">Fill in all the fields to add a class</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Class ID:</label>
                            <input
                                type="text"
                                name="classID"
                                value={formData.classID}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Class Name:</label>
                            <input
                                type="text"
                                name="className"
                                value={formData.className}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Sport:</label>
                            <select
                                name="sportID"
                                value={formData.sportID}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select Sport</option>
                                {sports.map(sport => (
                                    <option key={sport.sportID} value={sport.sportID}>
                                        {sport.sportName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Coach:</label>
                            <select
                                name="coachID"
                                value={formData.coachID}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select Coach</option>
                                {coaches.map(coach => (
                                    <option key={coach.coachID} value={coach.coachID}>
                                        {coach.coachName} - {coach.type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Age Category:</label>
                            <select
                                name="ageCategoryID"
                                value={formData.ageCategoryID}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select Age Category</option>
                                {ageCategories.map(category => (
                                    <option key={category.ageCategoryID} value={category.ageCategoryID}>
                                        {category.CategoryName} - {category.type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Term:</label>
                            <select
                                name="termID"
                                value={formData.termID}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select Term</option>
                                {terms.map(term => (
                                    <option key={term.termID} value={term.termID}>
                                        {term.termName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Days:</label>
                            <input
                                type="text"
                                name="days"
                                value={formData.days}
                                onChange={handleChange}
                                required
                                placeholder="Enter days (e.g. Monday, Wednesday)"
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Timing:</label>
                            <input
                                type="text"
                                name="timing"
                                value={formData.timing}
                                onChange={handleChange}
                                required
                                placeholder="Enter timing (e.g. 10:00 AM - 12:00 PM)"
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Class Type:</label>
                            <div className="mt-1 flex space-x-4">
                                <label className="text-sm font-medium text-gray-100">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="General"
                                        checked={formData.type === 'General'}
                                        onChange={handleChange}
                                        required
                                        className="mr-2"
                                    />
                                    General
                                </label>
                                <label className="text-sm font-medium text-gray-100">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="Elite"
                                        checked={formData.type === 'Elite'}
                                        onChange={handleChange}
                                        required
                                        className="mr-2"
                                    />
                                    Elite
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Location:</label>
                            <select
                                name="locationID"
                                value={formData.locationID}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select Location</option>
                                {locations.map(location => (
                                    <option key={location.locationID} value={location.locationID}>
                                        {location.locationName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {loading ? 'Adding Class...' : 'Add Class'}
                        </button>
                        {alertMessage && <p className="mt-2 text-gray-600">{alertMessage}</p>}

                    </form>
                </motion.div>
                <a href="/superadmin/view-class" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default AddClass;
