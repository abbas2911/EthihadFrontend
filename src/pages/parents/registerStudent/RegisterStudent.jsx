import Header from "../../../components/common/parents/Header";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const RegisterStudent = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '+971',
        birthday: '',
        gender: '',
        nationality: 'India',
        current_school: '',
        emiratesID: '',
        transport_pickup: '',
        transport_drop: '',
        address: '',
        ageCategoryID: '',
        medical_conditions: '',
        emiratesIDImage: null,
        studentPhoto: null, // Add student's photo to form data
        locationID: '2',
        agreedToTerms: false,
      });

    const [ageCategories, setAgeCategories] = useState([]);
    const [locationsID, setLocationsID] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [openAlert, setOpenAlert] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/studentAgeCategory')
            .then(response => {
                setAgeCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching age categories:', error);
            });

        axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/admin/fetchLocationID')
            .then(response => {
                setLocationsID(response.data);
            })
            .catch(error => {
                console.error('Error fetching location ID:', error);
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
  
          await axios.post('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/parent/registerNewStudent', formDataWithImage, {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data',
              }
          });
  
          setAlertMessage('Student registered successfully');
          setAlertSeverity('success');
          setOpenAlert(true);

          navigate('/parent/choose-sport');
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
            <p className="text-xs mt-1 text-gray-400">Fill in all the details to register your child.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-100">First Name</label>
                <input
                  placeholder="Enter the First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100">Last Name</label>
                <input
                  placeholder="Enter the Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100">Email</label>
                <input
                  placeholder="Enter the Email, for example: example@example.com"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100">Phone</label>
                <input
                  placeholder="561234567"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100">Birthday</label>
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
                <label className="block text-sm font-medium text-gray-100">Gender</label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center text-gray-200">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={handleChange}
                      className="form-radio"
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
                      className="form-radio"
                      required
                    />
                    <span className="ml-2">Female</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100">Nationality</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                >
                  {countries.map((country, index) => (
                    <option key={index} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100">Current School</label>
                <input
                  placeholder="Enter the Current School"
                  type="text"
                  name="current_school"
                  value={formData.current_school}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100">Emirates ID</label>
                <input
                  placeholder="Enter the Emirates ID"
                  type="text"
                  name="emiratesID"
                  value={formData.emiratesID}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100">Transport Pickup</label>
                <input
                  placeholder="Enter the Pickup Point"
                  type="text"
                  name="transport_pickup"
                  value={formData.transport_pickup}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100">Transport Drop</label>
                <input
                  placeholder="Enter the Drop Point"
                  type="text"
                  name="transport_drop"
                  value={formData.transport_drop}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100">Address</label>
                <input
                  placeholder="Enter the Address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100">Age Category</label>
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
                <label className="block text-sm font-medium text-gray-100">Medical Conditions</label>
                <input
                  placeholder="Enter any Medical Conditions"
                  type="text"
                  name="medical_conditions"
                  value={formData.medical_conditions}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
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
                <label className="block text-sm font-medium text-gray-100">Location ID</label>
                <select
                  name="locationID"
                  value={formData.locationID}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                >
                  <option value="">Select Location</option>
                    {locationsID.map((location) => (
                      <option key={location.locationID} value={location.locationID}>{location.locationName}</option>
                    ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-sm text-gray-100">
                  I agree to the -
                  <a 
                    href="/terms-and-conditions" 
                    className="text-blue-500 underline hover:text-blue-700" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Terms and Conditions
                  </a>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ${
                !formData.agreedToTerms ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!formData.agreedToTerms}
            >
              Register Student
            </button>

            <div className="text-sm mt-2 text-red-400">
              <p>
                  <strong>Note:</strong> To complete the registration process, please select the sport(s) your child will be participating in. 
                  <a href="/parent/choose-sport" className="text-blue-500 underline hover:text-blue-700">
                      Click here
                  </a> to choose the sport(s).
              </p>
          </div>
          </form>
        </motion.div>
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

export default RegisterStudent