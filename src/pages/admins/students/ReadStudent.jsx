import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../../../components/common/admins/Header';  // Assuming you have a Header component

const ReadStudent = () => {
    const { studentID } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/read-students/${studentID}`)
            .then(response => {
                setStudent(response.data[0]);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching student details:", error);
                setLoading(false);
            });
    }, [studentID]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!student) {
        return <div>Student not found.</div>;
    }

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Read Student" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Full Student Information</h2>
                    </div>

                    <div className="text-gray-300 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-100 mb-3">Personal Information</h3>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs'>
                            <p><strong>Full Name:</strong> {student.fullName}</p>
                            <p><strong>Email:</strong> {student.email}</p>
                            <p><strong>Phone:</strong> {student.phone}</p>
                            <p><strong>Birthday:</strong> {new Date(student.birthday).toLocaleDateString()}</p>
                            <p><strong>Gender:</strong> {student.gender}</p>
                            <p><strong>Nationality:</strong> {student.nationality}</p>
                            <p><strong>Current School:</strong> {student.current_school}</p>
                            <p><strong>Emirates ID:</strong> {student.emiratesID}</p>
                            <p><strong>Transport Pickup:</strong> {student.transport_pickup}</p>
                            <p><strong>Transport Drop:</strong> {student.transport_drop}</p>
                            <p><strong>Address:</strong> {student.address}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-100 mb-3 mt-7">Age & Location</h3>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs'>
                                <p><strong>Age Category:</strong> {student.ageCategoryName}</p>
                                <p><strong>Location:</strong> {student.locationName}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-100 mb-3 mt-7">Additional Information</h3>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs'>
                                <p><strong>Medical Conditions:</strong> {student.medical_conditions}</p>
                                <p><strong>Type:</strong> {student.type}</p>
                                <p><strong>Active:</strong> {student.active ? "Yes" : "No"}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-100 mb-3 mt-7">Images</h3>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs'>
                                {student.emiratesIDImage && (
                                    <div className="mb-4">
                                        <h4 className="text-md font-semibold text-gray-100">Emirates ID Image:</h4>
                                        <img 
                                            src={`data:image/jpeg;base64,${student.emiratesIDImage}`} 
                                            alt="Emirates ID" 
                                            className="w-48 h-auto rounded-md shadow-md mt-2" 
                                        />
                                    </div>
                                )}
                                
                                {student.studentPhoto && (
                                    <div className="mb-4">
                                        <h4 className="text-md font-semibold text-gray-100">Student Photo:</h4>
                                        <img 
                                            src={`data:image/jpeg;base64,${student.studentPhoto}`} 
                                            alt="Student" 
                                            className="w-48 h-auto rounded-md shadow-md mt-2" 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
                <a href="/admin/view-student" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
            </main>
        </div>
    );
};

export default ReadStudent;