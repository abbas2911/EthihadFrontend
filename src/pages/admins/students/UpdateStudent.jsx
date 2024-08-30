import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/common/admins/Header';
import { motion } from 'framer-motion';

const UpdateStudent = () => {
    const { studentID } = useParams();

    const [student, setStudent] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthday: '',
        gender: '',
        nationality: '',
        current_school: '',
        emiratesID: '',
        transport_pickup: '',
        transport_drop: '',
        address: '',
        ageCategoryID: '',
        medical_conditions: '',
        type: '',
        active: false,
        locationID: '',
        emiratesIDImage: null,
        studentPhoto: null,
    });
    const [originalStudent, setOriginalStudent] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); 
    const [ageCategories, setAgeCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/read-students/${studentID}`);
                if (response.data.length > 0) {
                    const studentData = response.data[0];
                    setStudent({
                        firstName: studentData.firstName,
                        lastName: studentData.lastName,
                        email: studentData.email,
                        phone: studentData.phone,
                        birthday: studentData.birthday.split('T')[0], // Format the date to yyyy-MM-dd
                        gender: studentData.gender,
                        nationality: studentData.nationality,
                        current_school: studentData.current_school,
                        emiratesID: studentData.emiratesID,
                        transport_pickup: studentData.transport_pickup,
                        transport_drop: studentData.transport_drop,
                        address: studentData.address,
                        ageCategoryID: studentData.ageCategoryID,
                        medical_conditions: studentData.medical_conditions,
                        type: studentData.type,
                        active: studentData.active === 1,
                        locationID: studentData.locationID,
                        emiratesIDImage: null,
                        studentPhoto: null,
                    });
                    setOriginalStudent(studentData);
                    // Handle individual previews
                    setImagePreview({
                        emiratesIDImage: studentData.emiratesIDImage ? `data:image/jpeg;base64,${studentData.emiratesIDImage}` : null,
                        studentPhoto: studentData.studentPhoto ? `data:image/jpeg;base64,${studentData.studentPhoto}` : null,
                    });
                } else {
                    setStudent(null);
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };
    
        fetchStudent();
    }, [studentID]);    
    

    useEffect(() => {
        const fetchDropdownOptions = async () => {
            try {
                const ageCategoryResponse = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/studentAgeCategory`);
                const locationResponse = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/fetchLocationID`);

                setAgeCategories(ageCategoryResponse.data);
                setLocations(locationResponse.data);
            } catch (error) {
                console.error('Error fetching dropdown options:', error);
            }
        };

        fetchDropdownOptions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent((prevStudent) => ({
            ...prevStudent,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        setStudent((prevStudent) => ({
            ...prevStudent,
            [name]: file,
        }));
    
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview((prevPreview) => ({
                ...prevPreview,
                [name]: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            student.firstName === originalStudent.firstName &&
            student.lastName === originalStudent.lastName &&
            student.email === originalStudent.email &&
            student.phone === originalStudent.phone &&
            student.birthday === originalStudent.birthday &&
            student.gender === originalStudent.gender &&
            student.nationality === originalStudent.nationality &&
            student.current_school === originalStudent.current_school &&
            student.emiratesID === originalStudent.emiratesID &&
            student.transport_pickup === originalStudent.transport_pickup &&
            student.transport_drop === originalStudent.transport_drop &&
            student.address === originalStudent.address &&
            student.ageCategoryID === originalStudent.ageCategoryID &&
            student.medical_conditions === originalStudent.medical_conditions &&
            student.type === originalStudent.type &&
            student.active === originalStudent.active &&
            student.locationID === originalStudent.locationID &&
            !student.emiratesIDImage &&
            !student.studentPhoto
        ) {
            setMessage('No changes to update.');
        } else {
            const formData = new FormData();
            formData.append('firstName', student.firstName);
            formData.append('lastName', student.lastName);
            formData.append('email', student.email);
            formData.append('phone', student.phone);
            formData.append('birthday', student.birthday);
            formData.append('gender', student.gender);
            formData.append('nationality', student.nationality);
            formData.append('current_school', student.current_school);
            formData.append('emiratesID', student.emiratesID);
            formData.append('transport_pickup', student.transport_pickup);
            formData.append('transport_drop', student.transport_drop);
            formData.append('address', student.address);
            formData.append('ageCategoryID', student.ageCategoryID);
            formData.append('medical_conditions', student.medical_conditions);
            formData.append('type', student.type);
            formData.append('active', student.active ? 'true' : 'false');
            formData.append('locationID', student.locationID);
    
            // Handle each image individually
            if (student.emiratesIDImage instanceof File) {
                formData.append('emiratesIDImage', student.emiratesIDImage);
            }
            if (student.studentPhoto instanceof File) {
                formData.append('studentPhoto', student.studentPhoto);
            }
    
            try {
                const response = await axios.put(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/update-student/${studentID}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                const updatedStudent = response.data;
    
                if (!updatedStudent.emiratesIDImage && originalStudent.emiratesIDImage) {
                    updatedStudent.emiratesIDImage = originalStudent.emiratesIDImage;
                }
                if (!updatedStudent.studentPhoto && originalStudent.studentPhoto) {
                    updatedStudent.studentPhoto = originalStudent.studentPhoto;
                }
    
                setStudent(updatedStudent);
                setOriginalStudent(updatedStudent);
    
                setImagePreview({
                    emiratesIDImage: updatedStudent.emiratesIDImage ? `data:image/jpeg;base64,${updatedStudent.emiratesIDImage}` : null,
                    studentPhoto: updatedStudent.studentPhoto ? `data:image/jpeg;base64,${updatedStudent.studentPhoto}` : null,
                });
    
                setAlertMessage('Student updated successfully.');
                setAlertSeverity('success');
                setOpenAlert(true);
            } catch (error) {
                console.error('Error updating student data:', error);
                setAlertMessage('Error updating student data.');
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

    const countries = [
        "India", "United Arab Emirates", "United States", "United Kingdom", "Canada", "Australia", "China", "France", "Germany", "Italy", "Japan", "Russia", "South Korea", "Spain", "Brazil", "Mexico", "South Africa", "New Zealand"
    ];

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Update Student" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Update Form</h2>
                        <p className="text-xs mt-1 text-gray-400">Change the details you want to update.</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-100">First Name:</label>
                                    <input 
                                        type="text" 
                                        name="firstName" 
                                        value={student.firstName} 
                                        onChange={handleChange} 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Last Name:</label>
                                    <input 
                                        type="text" 
                                        name="lastName" 
                                        value={student.lastName} 
                                        onChange={handleChange}
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Email:</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={student.email} 
                                        onChange={handleChange} 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Phone:</label>
                                    <input 
                                        type="text" 
                                        name="phone" 
                                        value={student.phone} 
                                        onChange={handleChange} 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"  
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Birthday:</label>
                                    <input 
                                        type="date" 
                                        name="birthday" 
                                        value={student.birthday} 
                                        onChange={handleChange} 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
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
                                            checked={student.gender === 'Male'} 
                                            onChange={handleChange} 
                                            className="focus:ring-blue-500 focus:border-blue-500 text-blue-600 border-gray-700" 
                                        />
                                        <span className="ml-2">Male</span>
                                    </label>
                                    <label className="inline-flex items-center text-gray-200">
                                        <input 
                                            type="radio" 
                                            name="gender" 
                                            value="Female" 
                                            checked={student.gender === 'Female'} 
                                            onChange={handleChange} 
                                            className="focus:ring-blue-500 focus:border-blue-500 text-blue-600 border-gray-700" 
                                        />
                                        <span className="ml-2">Female</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Nationality:</label>
                                <select 
                                    name="nationality" 
                                    value={student.nationality} 
                                    onChange={handleChange} 
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
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
                                        value={student.current_school} 
                                        onChange={handleChange} 
                                        placeholder="Enter current school" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Emirates ID:</label>
                                    <input 
                                        type="text" 
                                        name="emiratesID"
                                        value={student.emiratesID} 
                                        onChange={handleChange} 
                                        placeholder="Enter Emirates ID" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Transport Pickup:</label>
                                    <input 
                                        type="text" 
                                        name="transport_pickup" 
                                        value={student.transport_pickup} 
                                        onChange={handleChange} 
                                        placeholder="Enter transport pickup" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Transport Drop:</label>
                                    <input 
                                        type="text" 
                                        name="transport_drop" 
                                        value={student.transport_drop} 
                                        onChange={handleChange} 
                                        placeholder="Enter transport drop" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Address:</label>
                                    <input 
                                        type="text" 
                                        name="address" 
                                        value={student.address} 
                                        onChange={handleChange} 
                                        placeholder="Enter address" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                    />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Age Category:</label>
                                    <select
                                        name="ageCategoryID"
                                        value={student.ageCategoryID}
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
                                        value={student.medical_conditions} 
                                        onChange={handleChange} 
                                        placeholder="Enter medical conditions" 
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900" 
                                    />
                            </div>

                            <div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs'>
                                    {imagePreview && imagePreview.emiratesIDImage && (
                                        <div className="mb-4">
                                            <h4 className="text-md font-semibold text-gray-100">Current Emirates ID Image:</h4>
                                            <img 
                                                src={imagePreview.emiratesIDImage} 
                                                alt="Emirates ID" 
                                                className="w-48 h-auto rounded-md shadow-md mt-2" 
                                            />
                                        </div>
                                    )}
                                </div>
                                <label className="block text-sm font-medium text-gray-100">Select Emirates ID Image</label>
                                <input
                                    type="file"
                                    name="emiratesIDImage"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-100"
                                />
                            </div>

                            <div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs'>
                                    {imagePreview && imagePreview.studentPhoto && (
                                        <div className="mb-4">
                                            <h4 className="text-md font-semibold text-gray-100">Current Student Photo:</h4>
                                            <img 
                                                src={imagePreview.studentPhoto} 
                                                alt="Student Photo" 
                                                className="w-48 h-auto rounded-md shadow-md mt-2" 
                                            />
                                        </div>
                                    )}
                                </div>
                                <label className="block text-sm font-medium text-gray-100">Select Student Photo</label>
                                <input
                                    type="file"
                                    name="studentPhoto"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-100"
                                />
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs'>
                                {student.studentPhoto && (
                                    <div className="mb-4">
                                        <h4 className="text-md font-semibold text-gray-100">Student Photo:</h4>
                                        <img 
                                            src={imagePreview} 
                                            alt="Student Photo" 
                                            className="w-48 h-auto rounded-md shadow-md mt-2" 
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-100">Type:</label>
                                <div className="mt-2 space-x-4">
                                    <label className="inline-flex items-center text-gray-200">
                                        <input 
                                            type="radio" 
                                            name="type" 
                                            value="General" 
                                            checked={student.type === 'General'} 
                                            onChange={handleChange} 
                                            className="focus text-blue-600 border-gray-700" 
                                        />
                                        <span className="ml-2">General</span>
                                    </label>
                                    <label className="inline-flex items-center text-gray-200">
                                        <input 
                                            type="radio" 
                                            name="type" 
                                            value="Elite" 
                                            checked={student.type === 'Elite'} 
                                            onChange={handleChange} 
                                            className="focus text-blue-600 border-gray-700" 
                                        />
                                        <span className="ml-2">Elite</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Active Status:</label>
                                <select
                                    name="active"
                                    value={student.active ? '1' : '0'}
                                    onChange={handleChange}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-100">Location ID</label>
                                <select
                                    name="locationID"
                                    value={student.locationID}
                                    onChange={handleChange}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                                >
                                    {locations.map((location) => (
                                        <option key={location.locationID} value={location.locationID}>{location.locationName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <button 
                                    type="submit" 
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                    Update Student
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

export default UpdateStudent;