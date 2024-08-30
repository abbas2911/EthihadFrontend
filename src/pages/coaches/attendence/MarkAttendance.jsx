import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";
import Header from "../../../components/common/coaches/Header";

const MarkAttendance = () => {
    const { classID } = useParams();
    const [classDetails, setClassDetails] = useState({});
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
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


    const handleCheckboxChange = (studentID) => {
        setAttendance(prevAttendance => ({
            ...prevAttendance,
            [studentID]: !prevAttendance[studentID]
        }));
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const selectedStudents = Object.keys(attendance).filter(studentID => attendance[studentID]);
            await axios.post('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/coach/markAttendance', {
                classID,
                studentIDs: selectedStudents,
                sessionDate
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlertMessage('Attendance marked successfully');
            setAlertSeverity('success');
            setOpenAlert(true);

        } catch (error) {
            if (error.response && error.response.data) {
                setAlertMessage(error.response.data.msg);
                setAlertSeverity('error');
                setOpenAlert(true);
            } else {
                console.error('Error marking attendance:', error);
                setAlertMessage('Attendance not marked successfully');
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

    const StudentCard = ({ student, isChecked, handleCheckboxChange }) => (
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
                <label className=" text-sm text-gray-100">
                    Present
                </label>
                <input
                    type="checkbox"
                    className="form-checkbox text-indigo-600"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(student.studentID)}
                />
          </div>
        </div>
      ); 

    return (
    <div className="flex-1 overflow-auto relative z-10">
        <Header title="Mark Attendance" />
    
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
                        <h2 className="text-xl font-semibold text-gray-100">Mark Attendance for {classDetails.className}</h2>
                        <p className="text-xs mt-1 text-gray-400">{classDetails.days} at {classDetails.timing}</p>
                        <p className="text-xs mt-1 text-gray-400">Please select the day you are marking the attendance for and the students who were present only.</p>
                    </div>
        
                    <div className="mb-4">
                        <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="sessionDate">Session Date</label>
                        <input
                            type="date"
                            id="sessionDate"
                            value={sessionDate}
                            onChange={e => setSessionDate(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
        
                    {students.length > 0 ? (
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {students.map(student => (
                                <StudentCard
                                    key={student.studentID}
                                    student={student}
                                    isChecked={!!attendance[student.studentID]}
                                    handleCheckboxChange={handleCheckboxChange}
                                />
                            ))}
                        </div>
                        <button
                            type="submit"
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Submit Attendance
                        </button>
                    </form>
                    ) : (
                    <p className="text-gray-400">No students found for this class.</p>
                    )}
                </div>
                )}
            </motion.div>
            <a href="/coach/attendance" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default MarkAttendance