import { useState, useEffect } from 'react';
import Header from "../../../components/common/parents/Header";
import { motion } from 'framer-motion';
import axios from "axios";

const Gallery = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchClasses(selectedStudent);
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/parent/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async (studentID) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/parent/classes/${studentID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(response.data);
      setSelectedClass(''); // Reset selected class when new student is selected
      if (response.data.length === 0) {
        setError('No classes found for this student');
      } else {
        setError('');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Error fetching classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (studentID, classID) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/parent/gallery/${studentID}/${classID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.length === 0) {
        setError('No images found for this student in this class');
        setImages([]); // Ensure images array is empty if no images are found
      } else {
        setImages(response.data);
        setError(''); // Clear any previous errors
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('No images found for this student in this class');
      setImages([]); // Ensure images array is empty on error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchImages(selectedStudent, selectedClass);
  };

  const handleStudentChange = (event) => {
    const studentID = event.target.value;
    setSelectedStudent(studentID);
    setImages([]); // Reset images when a new student is selected
    setError(''); // Reset error when a new student is selected
  };

  const handleClassChange = (event) => {
    const classID = event.target.value;
    setSelectedClass(classID);
    setImages([]); // Reset images when a new class is selected
    setError(''); // Reset error when a new class is selected
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Gallery" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {loading ? (
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8 animate-pulse"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="mb-6">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-600 rounded w-1/2"></div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-100">Gallery</h2>
              <p className="text-xs mt-1 text-gray-400">
                Select your child and their class to view photos (if any).
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="student"
                  className="block text-sm font-medium text-gray-300"
                >
                  Select Student
                </label>
                <select
                  id="student"
                  value={selectedStudent}
                  onChange={handleStudentChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="" disabled>Select a student</option>
                  {students.map(student => (
                    <option key={student.studentID} value={student.studentID}>
                      {student.firstName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="class"
                  className="block text-sm font-medium text-gray-300"
                >
                  Select Class
                </label>
                <select
                  id="class"
                  value={selectedClass}
                  onChange={handleClassChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="" disabled>Select a class</option>
                  {classes.map(classItem => (
                    <option key={classItem.classID} value={classItem.classID}>
                      {classItem.className}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className={`w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow ${
                  !selectedStudent || !selectedClass || loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-indigo-700'
                }`}
                disabled={!selectedStudent || !selectedClass || loading}
              >
                {loading ? 'Loading...' : 'Submit'}
              </button>
            </form>

            {error && (
              <p className="text-red-500 text-sm mt-4">{error}</p>
            )}

            <div className="mt-6">
              {images.length > 0 ? (
                images.map(image => (
                  <div key={image.galleryID} className="mb-6 bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      className="w-full h-48 object-cover"
                      src={`data:image/jpeg;base64,${image.image}`}
                      alt={`Image ${image.galleryID}`}
                    />
                    <div className="p-4">
                      <p className="text-gray-200 text-sm">
                        Student ID: {image.studentID}
                      </p>
                      <p className="text-gray-200 text-sm">
                        Class ID: {image.classID}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                !error && <p className="text-gray-400">No images found.</p>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Gallery;