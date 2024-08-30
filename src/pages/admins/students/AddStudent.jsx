import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/common/admins/Header';
import { motion } from 'framer-motion';

const AddStudent = () => {
    const [formData, setFormData] = useState({
        parentID: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '+971',
        birthday: '',
        gender: 'Male',
        nationality: 'India',
        current_school: '',
        emiratesID: '',
        transport_pickup: '',
        transport_drop: '',
        address: '',
        ageCategoryID: '1',
        medical_conditions: '',
        emiratesIDImage: null,
        studentPhoto: null,
        type: 'General',
        active: '0',
        locationID: '1'
    });

    const [ageCategories, setAgeCategories] = useState([]);
    const [parentsID, setParentsID] = useState([]);
    const [locationsID, setLocationsID] = useState([]);
    const [sportsList, setSportsList] = useState([]);
    const [selectedSports, setSelectedSports] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/studentAgeCategory')
            .then(response => {
                setAgeCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching age categories:', error);
            });

        axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/fetchParentID')
            .then(response => {
                setParentsID(response.data);
            })
            .catch(error => {
                console.error('Error fetching parent IDs:', error);
            });

        axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/fetchLocationID')
            .then(response => {
                setLocationsID(response.data);
            })
            .catch(error => {
                console.error('Error fetching location IDs:', error);
            });

        axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/fetchSport')
            .then(response => {
                setSportsList(response.data);
            })
            .catch(error => {
                console.error('Error fetching sports:', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'radio') {
            if (checked) {
                setFormData(prevState => ({
                    ...prevState,
                    [name]: value
                }));
            }
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (value.startsWith('+971') && value.length <= 13) {
            setFormData(prevState => ({
                ...prevState,
                phone: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        setFormData(prevState => ({
          ...prevState,
          [e.target.name]: imageFile, // Handle both emiratesIDImage and studentPhoto
        }));
      };

    const handleSportClick = (e, sport) => {
        e.preventDefault();
        if (!selectedSports.some(s => s.sportID === sport.sportID)) {
            setSelectedSports([...selectedSports, sport]);
        }
    };

    const handleRemoveSport = (sportToRemove) => {
        const updatedSports = selectedSports.filter(sport => sport.sportID !== sportToRemove.sportID);
        setSelectedSports(updatedSports);
    };

    const validateEmail = (email) => {
        return email.includes('@') && email.endsWith('.com');
    };

    const validatePhone = (phone) => {
        const phonePattern = /^\+971(50|54|55|56)\d{7}$/;
        return phonePattern.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(formData.email)) {
            setAlertMessage("Invalid email. Email must contain '@' and end with '.com'.");
            setAlertSeverity('error');
            setOpenAlert(true);
            return;
        }

        if (!validatePhone(formData.phone)) {
            setAlertMessage("Invalid phone number. Phone number must start with '+971' followed by '50', '54', '55', or '56' and contain exactly 9 digits in total.");
            setAlertSeverity('error');
            setOpenAlert(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            const formDataWithImage = new FormData();
            for (let key in formData) {
                formDataWithImage.append(key, formData[key]);
            }

            const sportIDs = selectedSports.map(sport => sport.sportID);
            formDataWithImage.append('sportIDs', JSON.stringify(sportIDs));

            await axios.post('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/add-student', formDataWithImage, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            setAlertMessage('Student registered successfully');
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            setAlertMessage('Error registering student');
            setAlertSeverity('error');
            setOpenAlert(true);
            console.error('Error registering student:', error);
        }
    };

    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    const countries = [
        "India", "United Arab Emirates", "United States", "United Kingdom", "Canada", "Australia", "China", "France", "Germany", "Italy", "Japan", "Russia", "South Korea", "Spain", "Brazil", "Mexico", "South Africa", "New Zealand"
    ];

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Register Student" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Registration Form</h2>
                        <p className="text-xs mt-1 text-gray-400">Fill in all the details to register the child.</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-100">
                                    Parent ID:
                                </label>
                                <select 
                                    name="parentID" 
                                    value={formData.parentID} 
                                    onChange={handleChange} 
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                    required
                                >
                                    <option value="">Select Parent</option>
                                    {parentsID.map(parent => (
                                        <option key={parent.parentID} value={parent.parentID}>
                                            {parent.firstName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">First Name:</label>
                                    <input 
                                        type="text" 
                                        name="firstName" 
                                        value={formData.firstName} 
                                        onChange={handleChange} 
                                        placeholder="Enter first name" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                        required 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Last Name:</label>
                                    <input 
                                        type="text" 
                                        name="lastName" 
                                        value={formData.lastName} 
                                        onChange={handleChange} 
                                        placeholder="Enter last name" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                        required 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Email:</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        placeholder="Enter email" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                        required 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Phone:</label>
                                    <input 
                                        type="text" 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handlePhoneChange} 
                                        placeholder="Enter phone number" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                        required 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Birthday:</label>
                                    <input 
                                        type="date" 
                                        name="birthday" 
                                        value={formData.birthday} 
                                        onChange={handleChange} 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                        required 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Gender:</label>
                                <div className="mt-2 space-x-4">
                                    <label className="inline-flex items-center text-gray-200">
                                        <input 
                                            type="radio" 
                                            name="gender" 
                                            value="Male" 
                                            checked={formData.gender === 'Male'} 
                                            onChange={handleChange} 
                                            className="focus:ring-blue-500 focus:border-blue-500 text-blue-600 border-gray-700" 
                                            required 
                                        />
                                        <span className="ml-2">Male</span>
                                    </label>
                                    <label className="inline-flex items-center text-gray-200">
                                        <input 
                                            type="radio" 
                                            name="gender" 
                                            value="Female" 
                                            checked={formData.gender === 'Female'} 
                                            onChange={handleChange} 
                                            className="focus:ring-blue-500 focus:border-blue-500 text-blue-600 border-gray-700" 
                                            required
                                        />
                                        <span className="ml-2">Female</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Nationality:</label>
                                <select 
                                    name="nationality" 
                                    value={formData.nationality} 
                                    onChange={handleChange} 
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                    required
                                >
                                    {countries.map((country, index) => (
                                        <option key={index} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Current School:</label>
                                    <input 
                                        type="text" 
                                        name="current_school" 
                                        value={formData.current_school} 
                                        onChange={handleChange} 
                                        placeholder="Enter current school" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                        required 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Emirates ID:</label>
                                    <input 
                                        type="text" 
                                        name="emiratesID" 
                                        value={formData.emiratesID} 
                                        onChange={handleChange} 
                                        placeholder="Enter Emirates ID" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                        required 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Transport Pickup:</label>
                                    <input 
                                        type="text" 
                                        name="transport_pickup" 
                                        value={formData.transport_pickup} 
                                        onChange={handleChange} 
                                        placeholder="Enter transport pickup" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                        required 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Transport Drop:</label>
                                    <input 
                                        type="text" 
                                        name="transport_drop" 
                                        value={formData.transport_drop} 
                                        onChange={handleChange} 
                                        placeholder="Enter transport drop" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                        required
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Address:</label>
                                    <input 
                                        type="text" 
                                        name="address" 
                                        value={formData.address} 
                                        onChange={handleChange} 
                                        placeholder="Enter address" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                        required 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Age Category:</label>
                                    <select
                                        name="ageCategoryID"
                                        value={formData.ageCategoryID}
                                        onChange={handleChange}
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                    >
                                        <option value="">Select Age Category</option>
                                            {ageCategories.map((category) => (
                                                <option key={category.ageCategoryID} value={category.ageCategoryID}>{category.CategoryName}</option>
                                            ))}
                                    </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Medical Conditions:</label>
                                    <input 
                                        type="text" 
                                        name="medical_conditions" 
                                        value={formData.medical_conditions} 
                                        onChange={handleChange} 
                                        placeholder="Enter medical conditions" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                        required
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Emirates ID Image</label>
                                    <input
                                        type="file"
                                        name="emiratesIDImage"
                                        onChange={handleImageChange}
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-100"
                                        required
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Student Photo</label>
                                    <input
                                        type="file"
                                        name="studentPhoto"
                                        onChange={handleImageChange}
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-100"
                                        required
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Type:</label>
                                <div className="mt-2 space-x-4">
                                    <label className="inline-flex items-center text-gray-200">
                                        <input 
                                            type="radio" 
                                            name="type" 
                                            value="General" 
                                            checked={formData.type === 'General'} 
                                            onChange={handleChange} 
                                            className="focus text-blue-600 border-gray-700" 
                                            required 
                                        />
                                        <span className="ml-2">General</span>
                                    </label>
                                    <label className="inline-flex items-center text-gray-200">
                                        <input 
                                            type="radio" 
                                            name="type" 
                                            value="Elite" 
                                            checked={formData.type === 'Elite'} 
                                            onChange={handleChange} 
                                            className="focus text-blue-600 border-gray-700" 
                                        />
                                        <span className="ml-2">Elite</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Active:</label>
                                <div className="mt-2 space-x-4">
                                    <label className="inline-flex items-center text-gray-200">
                                        <input 
                                            type="radio" 
                                            name="active" 
                                            value="1" 
                                            checked={formData.active === '1'} 
                                            onChange={handleChange} 
                                            className="focus text-blue-600 border-gray-700" 
                                            required 
                                        />
                                        <span className="ml-2">Active</span>
                                    </label>
                                    <label className="inline-flex items-center text-gray-200">
                                        <input 
                                            type="radio" 
                                            name="active" 
                                            value="0" 
                                            checked={formData.active === '0'} 
                                            onChange={handleChange} 
                                            className="focus text-blue-600 border-gray-700" 
                                        />
                                        <span className="ml-2">Inactive</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Location ID</label>
                                <select
                                    name="locationID"
                                    value={formData.locationID}
                                    onChange={handleChange}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                >
                                    {locationsID.map((location) => (
                                        <option key={location.locationID} value={location.locationID}>{location.locationName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">
                                    Select Sports:
                                </label>
                                <div className="flex flex-wrap">
                                    {sportsList.map(sport => (
                                        <button
                                            key={sport.sportID}
                                            onClick={(e) => handleSportClick(e, sport)}
                                            className={`px-4 py-2 m-1 border rounded-md ${
                                                selectedSports.some(s => s.sportID === sport.sportID)
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-blue-600 border-blue-600'
                                            }`}
                                        >
                                            {sport.sportName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">
                                    Selected Sports:
                                </label>
                                <div className="flex flex-wrap">
                                    {selectedSports.map(sport => (
                                        <div key={sport.sportID} className="flex items-center m-1 p-2 border rounded-md border-gray-500">
                                            <span>{sport.sportName}</span>
                                            <button
                                                onClick={() => handleRemoveSport(sport)}
                                                className="ml-2 px-2 py-1 bg-red-600 text-white rounded-md"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <button 
                                    type="submit" 
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                    Register Student
                                </button>
                            </div>
                        </div>
                    </form>
                </motion.div>
                <a href="/admin/view-student" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default AddStudent;