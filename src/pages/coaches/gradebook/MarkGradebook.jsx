import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";
import Header from "../../../components/common/coaches/Header";

const MarkGradebook = () => {
    const { classID } = useParams();
    const [classDetails, setClassDetails] = useState({});
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState({});
    const [comments, setComments] = useState({});
    const [loading, setLoading] = useState(true);
    const [week, setWeek] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        const fetchClassDetailsAndStudents = async () => {
          try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/coach/classDetails/${classID}`, {
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


    const handleGradeChange = (studentID, grade) => {
        setGrades(prevGrades => ({
            ...prevGrades,
            [studentID]: grade            
        }));
        console.log("Grades:", grade);
    };

    const handleCommentChange = (studentID, comment) => {
        setComments(prevComments => ({
            ...prevComments,
            [studentID]: comment
        }));
        console.log("Comments:", comment);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            classID,
            week,
            grades,
            comments
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/coach/markGradebook', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setAlertMessage('Grades marked successfully');
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            if (error.response && error.response.data) {
                setAlertMessage(error.response.data.msg);
                setAlertSeverity('error');
                setOpenAlert(true);
            } else {
                console.error('Error marking grades:', error);
                setAlertMessage('Grades not marked successfully');
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

    const StudentCard = ({ student, grade, comment, handleGradeChange, handleCommentChange }) => (
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

            <div className="flex items-center justify-between p-4 border-t">
                <label className="block mb-2 text-sm font-medium text-gray-200">Grade</label>
                <select
                    className="px-4 py-2 text-gray-100 bg-gray-800 bg-opacity-70 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={grade || ''}
                    onChange={(e) => handleGradeChange(student.studentID, e.target.value)}
                >
                    <option value="">Select Grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                </select>
            </div>

            <div className="p-4 border-t">
                <label className="block mb-2 text-sm font-medium text-gray-200">Comment</label>
                <textarea
                    className="w-full px-4 py-2 text-indigo-600 bg-gray-800 bg-opacity-70 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    value={comment || ''}
                    onChange={(e) => handleCommentChange(student.studentID, e.target.value)}
                    rows={2}
                    placeholder="Enter your comment here..."
                >
                </textarea>
            </div>
        </div>
    ); 

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Mark Gradebook" />
    
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
                                <h2 className="text-xl font-semibold text-gray-100">Mark Grade for {classDetails.className}</h2>
                                <p className="text-xs mt-1 text-gray-400">{classDetails.days} at {classDetails.timing}</p>
                                <p className="text-xs mt-1 text-gray-400">Please select the week you are marking the grade for.</p>
                            </div>
        
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-200">Week</label>
                                <select
                                    className="w-full px-4 py-2 text-gray-100 bg-gray-800 bg-opacity-70 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={week}
                                    onChange={(e) => setWeek(e.target.value)}
                                >
                                    <option value="">Select Week</option>
                                    {[...Array(15).keys()].map(w => (
                                        <option key={w + 1} value={w + 1}>
                                            Week {w + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
        
                            {students.length > 0 ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                                        {students.map(student => (
                                            <StudentCard
                                                key={student.studentID}
                                                student={student}
                                                grade={grades[student.studentID]}
                                                comment={comments[student.studentID]}
                                                handleGradeChange={handleGradeChange}
                                                handleCommentChange={handleCommentChange}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        type="submit"
                                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Submit Grades
                                    </button>
                                </form>
                            ) : (
                                <p className="text-gray-400">No students found for this class.</p>
                            )}
                        </div>
                    )}
                </motion.div>
                <a href="/coach/gradebook" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default MarkGradebook