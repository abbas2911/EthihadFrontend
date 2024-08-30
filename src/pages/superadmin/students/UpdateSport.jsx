import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/common/admins/Header';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const UpdateSport = () => {
  const { studentID } = useParams();
  const [sports, setSports] = useState([]);
  const [allSports, setAllSports] = useState([]);
  const [modifiedSports, setModifiedSports] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/fetchSport')
      .then(response => {
        setAllSports(response.data);
      })
      .catch(error => {
        console.error('Error fetching all sports:', error);
      });

    axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/read-student-sports/${studentID}`)
      .then(response => {
        setSports(response.data);
      })
      .catch(error => {
        console.error('Error fetching sports data:', error);
        setAlertMessage('Failed to load sports data');
        setAlertSeverity('error');
        setOpenAlert(true);
      });
  }, [studentID]);

  const handleSubmit = () => {
    const sportsToUpdate = sports.filter(sport => modifiedSports.includes(sport.studentsportID));

    if (sportsToUpdate.length === 0) {
      setAlertMessage('No changes detected');
      setAlertSeverity('info');
      setOpenAlert(true);
      return;
    }

    axios.put(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/update-student-sports/${studentID}`, {
      sports: sportsToUpdate
    })
    .then(response => {
      setAlertMessage('Sports updated successfully');
      setAlertSeverity('success');
      setOpenAlert(true);
      setModifiedSports([]);
    })
    .catch(error => {
      console.error('Error updating sports:', error);
      setAlertMessage('Failed to update sports');
      setAlertSeverity('error');
      setOpenAlert(true);
    });
  };

  const handleDelete = (studentsportID) => {
    axios.delete(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/delete-student-sport/${studentID}/${studentsportID}`)
      .then(response => {
        setSports(sports.filter(sport => sport.studentsportID !== studentsportID));
        setAlertMessage('Sport deleted successfully');
        setAlertSeverity('success');
        setOpenAlert(true);
      })
      .catch(error => {
        console.error('Error deleting sport:', error);
        setAlertMessage('Failed to delete sport');
        setAlertSeverity('error');
        setOpenAlert(true);
      });
  };

  const handleInputChange = (studentsportID, field, value) => {
    setSports(sports.map(sport =>
      sport.studentsportID === studentsportID ? { ...sport, [field]: value } : sport
    ));
    setModifiedSports(prev => prev.includes(studentsportID) ? prev : [...prev, studentsportID]);
  };

  const handleSportChange = (studentsportID, newSportID) => {
    setSports(sports.map(sport =>
      sport.studentsportID === studentsportID ? { ...sport, sportID: newSportID } : sport
    ));
    setModifiedSports(prev => prev.includes(studentsportID) ? prev : [...prev, studentsportID]);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Update Sport" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-100">Update Student Sport</h2>
            <p className="text-xs mt-1 text-gray-400">Select or deselect the sport to update student sport(s)</p>
          </div>
          <form className="space-y-6">
            {sports.map(sport => (
              <div key={sport.studentsportID} className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-300">
                    Sport
                    <select
                      value={sport.sportID}
                      onChange={(e) => handleSportChange(sport.studentsportID, e.target.value)}
                      className="mt-1 block w-full bg-gray-700 text-gray-300 rounded-md border border-gray-600"
                    >
                      {allSports.map(s => (
                        <option key={s.sportID} value={s.sportID}>
                          {s.sportName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-gray-300 mt-2">
                    Remaining Sessions
                    <input
                      type="number"
                      value={sport.remaining_sessions}
                      onChange={(e) => handleInputChange(sport.studentsportID, 'remaining_sessions', e.target.value)}
                      className="mt-1 block w-full bg-gray-700 text-gray-300 rounded-md border border-gray-600"
                      placeholder="Remaining Sessions"
                    />
                  </label>
                  <label className="block text-gray-300 mt-2">
                    Grace Sessions
                    <input
                      type="number"
                      value={sport.grace_sessions}
                      onChange={(e) => handleInputChange(sport.studentsportID, 'grace_sessions', e.target.value)}
                      className="mt-1 block w-full bg-gray-700 text-gray-300 rounded-md border border-gray-600"
                      placeholder="Grace Sessions"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(sport.studentsportID)}
                  className="bg-red-600 text-white rounded-md px-4 py-2"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md"
            >
              Update Sports
            </button>
          </form>
        </motion.div>
        <a href="/superadmin/view-student" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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
              onClick={() => setOpenAlert(false)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default UpdateSport;