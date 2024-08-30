import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../../../components/common/superadmin/Header';

const UpdateClass = () => {
    const { classID } = useParams();
    const [classItem, setClassItem] = useState({
        className: '',
        sportID: '',
        coachID: '',
        ageCategoryID: '',
        termID: '',
        days: '',
        timing: '',
        type: '',
        locationID: '',
    });
    const [originalClass, setOriginalClass] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sports, setSports] = useState([]);
    const [terms, setTerms] = useState([]);
    const [locations, setLocations] = useState([]);
    const [ageCategories, setAgeCategories] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const response = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/supersuperadmin/read-class/${classID}`);
                if (response.data.length > 0) {
                    const classData = response.data[0];
                    setClassItem({
                        className: classData.className || '',
                        sportID: classData.sportID || '',
                        coachID: classData.coachID || '',
                        ageCategoryID: classData.ageCategoryID || '',
                        termID: classData.termID || '',
                        days: classData.days || '',
                        timing: classData.timing || '',
                        type: classData.type || '',
                        locationID: classData.locationID || '',
                    });
                    setOriginalClass(classData);
                } else {
                    setClassItem(null);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching class data:', error);
                setLoading(false);
            }
        };

        const fetchDropdownData = async () => {
            try {
                const [sportsResponse, termsResponse, locationsResponse, ageCategoriesResponse, coachesResponse] = await Promise.all([
                    axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/fetchSport'),
                    axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/fetchTerm'),
                    axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/fetchLocationID'),
                    axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/classAgeCategory'),
                    axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/fetchCoach')
                ]);
    
                setSports(sportsResponse.data);
                setTerms(termsResponse.data);
                setLocations(locationsResponse.data);
                setAgeCategories(ageCategoriesResponse.data);
                setCoaches(coachesResponse.data);
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };
        
        fetchClassData();
        fetchDropdownData();
    }, [classID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClassItem((prevClass) => ({
            ...prevClass,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (JSON.stringify(classItem) === JSON.stringify(originalClass)) {
            setAlertMessage('No changes to update.');
            setAlertSeverity('error');
            setOpenAlert(true);
        } else {
            try {
                const response = await axios.put(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/update-class/${classID}`, classItem);
                const updatedClass = response.data;

                setClassItem(updatedClass);
                setOriginalClass(updatedClass);

                setAlertMessage('Class updated successfully.');
                setAlertSeverity('success');
                setOpenAlert(true);
            } catch (error) {
                console.error('Error updating class data:', error);
                setAlertMessage('Error updating class data.');
                setAlertSeverity('error');
                setOpenAlert(true);
            }
        }
    };

    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    if (loading) {
        return <p className="text-white">Loading...</p>;
    }

    if (classItem === null) {
        return <p className="text-red-500">Class not found</p>;
    }

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Update Class" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* All fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">Class Name</label>
                            <input
                                type="text"
                                name="className"
                                value={classItem.className}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-100">Coach</label>
                            <select
                                name="coachID"
                                value={classItem.coachID}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select Coach</option>
                                {coaches.map((coach) => (
                                    <option key={coach.coachID} value={coach.coachID}>
                                        {coach.coachName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-100">Sport</label>
                            <select
                                name="sportID"
                                value={classItem.sportID}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select Sport</option>
                                {sports.map((sport) => (
                                    <option key={sport.sportID} value={sport.sportID}>
                                        {sport.sportName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-100">Age Category</label>
                            <select
                                name="ageCategoryID"
                                value={classItem.ageCategoryID}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select Age Category</option>
                                {ageCategories.map((ageCategory) => (
                                    <option key={ageCategory.ageCategoryID} value={ageCategory.ageCategoryID}>
                                        {ageCategory.ageCategoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-100">Term</label>
                            <select
                                name="termID"
                                value={classItem.termID}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select Term</option>
                                {terms.map((term) => (
                                    <option key={term.termID} value={term.termID}>
                                        {term.termName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-100">Days</label>
                            <input
                                type="text"
                                name="days"
                                value={classItem.days}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-100">Timing</label>
                            <input
                                type="text"
                                name="timing"
                                value={classItem.timing}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                        </div>

                        <div>
    <label className="block text-sm font-medium text-gray-100">Type</label>
    <select
        name="type"
        value={classItem.type}
        onChange={handleChange}
        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
    >
        <option value="">Select Type</option>
        <option value="general">General</option>
        <option value="elite">Elite</option>
    </select>
</div>

                        <div>
                            <label className="block text-sm font-medium text-gray-100">Location</label>
                            <select
                                name="locationID"
                                value={classItem.locationID}
                                onChange={handleChange}
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                                <option value="">Select Location</option>
                                {locations.map((location) => (
                                    <option key={location.locationID} value={location.locationID}>
                                        {location.locationName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Update Class
                        </button>
                    </form>
                    {alertMessage && <p className="mt-2 text-gray-600">{alertMessage}</p>}

                </motion.div>
                <a href="/superadmin/view-class" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default UpdateClass;
