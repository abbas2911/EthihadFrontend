import Header from "../../../components/common/parents/Header";
import axios from "axios";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const ChooseSport = () => {
  const [sports, setSports] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    // Fetch sports and students when the component mounts
    const fetchSportsAndStudents = async () => {
      try {
        // Fetch sports
        const token = localStorage.getItem('token');
        const sportsResponse = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/parent/fetchSports', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setSports(sportsResponse.data);

        // Fetch students (you might need to adjust this URL based on your API)
        const studentsResponse = await axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/parent/students', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setStudents(studentsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSportsAndStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/parent/studentsport', 
        { studentID: selectedStudent, sportID: selectedSport }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setAlertMessage(response.data.msg || 'Sport selected successfully!');
      setAlertSeverity('success');
      setOpenAlert(true);
    } catch (error) {
      console.error('Error submitting sport selection:', error);
      setAlertMessage('Failed to select sport. Please try again.');
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Choose Sport" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-100">Sport Form</h2>
            <p className="text-xs mt-1 text-gray-400">Please select the sport your child wants to do and assign it to a student.</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-100">Student</label>
              <select
                name="studentID"
                id="student"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
              >
                <option value="" disabled>Select a student</option>
                {students.map((student) => (
                  <option key={student.studentID} value={student.studentID}>
                    {student.firstName} (ID: {student.studentID})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-100">Sport</label>
              <select
                name="sportID"
                id="sport"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
              >
                <option value="" disabled>Select a sport</option>
                {sports.map((sport) => (
                  <option key={sport.sportID} value={sport.sportID}>
                    {sport.sportName}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
            <div className="text-sm mt-2 text-red-400">
              <p>
                  <strong>Note:</strong> If your child is not listed here, please complete their registration first. 
                  <a href="/parent/register-student" className="text-blue-500 underline hover:text-blue-700">
                      Click here
                  </a> to register.
              </p>
          </div>
          </form>
        </motion.div>

        {/* Alert Component */}
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
      </main>
    </div>
  );
};

export default ChooseSport;