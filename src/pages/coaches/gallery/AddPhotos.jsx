import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";
import { Trash2 } from 'lucide-react';
import Header from "../../../components/common/coaches/Header";

const AddPhotos = () => {
    const { classID } = useParams();
    const [classDetails, setClassDetails] = useState({});
    const [students, setStudents] = useState([]);
    const [images, setImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        const fetchClassDetailsAndStudents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/coach/classDetails/${classID}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setClassDetails(response.data.classDetails);
                setStudents(response.data.students);
            } catch (error) {
                console.error('Error fetching class details and students:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClassDetailsAndStudents();
    }, [classID]);

    const handleImageChange = (studentID, event) => {
        const files = event.target.files;
        setImages(prevImages => ({
            ...prevImages,
            [studentID]: prevImages[studentID] ? [...prevImages[studentID], ...files] : [...files]
        }));
    };

    const handleRemoveImage = (studentID, index) => {
        setImages(prevImages => {
            const updatedImages = [...prevImages[studentID]];
            updatedImages.splice(index, 1); // Remove the file at index
            return {
                ...prevImages,
                [studentID]: updatedImages
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('classID', classID);

        for (const studentID of Object.keys(images)) {
            images[studentID].forEach((file, index) => {
                formData.append(`images[${studentID}][${index}]`, file);
            });
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/coach/addPhotos', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setAlertMessage('Photos added successfully');
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            if (error.response && error.response.data) {
                setAlertMessage(error.response.data.msg);
                setAlertSeverity('error');
                setOpenAlert(true);
            } else {
                console.error('Error adding photos:', error);
                setAlertMessage('Error adding photos');
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

    const StudentCard = ({ student, images, handleImageChange, handleRemoveImage }) => (
        <div className="max-w-sm mx-2 my-4 p-4 bg-gray-700 rounded-lg shadow-md">
            <div className="w-full h-36 overflow-hidden rounded-t-lg">
                <img
                    className="w-full h-full object-contain"
                    src={student.studentPhoto ? `data:image/jpeg;base64,${student.studentPhoto}` : 'https://via.placeholder.com/150'}
                    alt={student.firstName}
                />
            </div>

            <div className="p-4">
                <div className="flex items-center space-x-2">
                    <div>
                        <h5 className="text-lg font-semibold text-gray-100">{student.firstName} {student.lastName}</h5>
                    </div>
                </div>
                <p className="text-gray-400 mt-2">Student ID: {student.studentID}</p>
            </div>

            <div className="p-4 border-t border-gray-600">
                <label className="block mb-2 text-sm font-medium text-gray-200">Insert Photo(s)</label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageChange(student.studentID, e)}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-100 bg-gray-800"
                />
                {images && (
                    <ul className="mt-2 space-y-1">
                        {images.map((file, index) => (
                            <li key={index} className="flex items-center justify-between text-gray-100">
                                <span>{file.name}</span>
                                <button
                                    onClick={() => handleRemoveImage(student.studentID, index)}
                                    className="ml-4 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    ); 

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Add Photos" />
    
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-100">Add Photos for {classDetails.className}</h2>
                                <p className="text-xs mt-1 text-gray-400">{classDetails.days} at {classDetails.timing}</p>
                                <p className="text-xs mt-1 text-gray-400">Please select the child you are inserting photo(s) for.</p>
                            </div>
        
                            {students.length > 0 ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                                        {students.map(student => (
                                            <StudentCard
                                                student={student}
                                                images={images[student.studentID]}
                                                handleImageChange={handleImageChange}
                                                handleRemoveImage={handleRemoveImage}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        type="submit"
                                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Submit Photos
                                    </button>
                                </form>
                            ) : (
                                <p className="text-gray-400">No students found for this class.</p>
                            )}
                        </div>
                    )}
                </motion.div>
                <a href="/coach/gallery" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default AddPhotos