import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../../../components/common/superadmin/Header';

const ReadClass = () => {
    const { classID } = useParams();
    const [classItem, setClassItem] = useState(null);
    const [sportMap, setSportMap] = useState({});
    const [termMap, setTermMap] = useState({});
    const [locationMap, setLocationMap] = useState({});
    const [ageCategoryMap, setAgeCategoryMap] = useState({});
    const [coachMap, setCoachMap] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                // Fetch class data
                const classResponse = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/read-class/${classID}`);
                if (classResponse.data && classResponse.data.length > 0) {
                    setClassItem(classResponse.data[0]);
                } else {
                    setClassItem(null);
                }

                // Fetch sport data
                const sportResponse = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/fetchSport');
                const sportData = sportResponse.data;
                const sportMap = sportData.reduce((map, sport) => {
                    map[sport.sportID] = sport.sportName;
                    return map;
                }, {});
                setSportMap(sportMap);

                // Fetch term data
                const termResponse = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/fetchTerm');
                const termData = termResponse.data;
                const termMap = termData.reduce((map, term) => {
                    map[term.termID] = term.termName;
                    return map;
                }, {});
                setTermMap(termMap);

                // Fetch location data
                const locationResponse = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/fetchLocationID');
                const locationData = locationResponse.data;
                const locationMap = locationData.reduce((map, location) => {
                    map[location.locationID] = location.locationName;
                    return map;
                }, {});
                setLocationMap(locationMap);

                // Fetch age category data
                const ageCategoryResponse = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/classAgeCategory');
                const ageCategoryData = ageCategoryResponse.data;
                const ageCategoryMap = ageCategoryData.reduce((map, category) => {
                    map[category.ageCategoryID] = category.ageCategoryName; // changed to match backend response
                    return map;
                }, {});
                setAgeCategoryMap(ageCategoryMap);


                // Fetch coach data
                const coachResponse = await axios.get('https://ethihad-backend-server-4565c742307a.herokuapp.com/api/superadmin/fetchCoach');
                const coachData = coachResponse.data;
                const coachMap = coachData.reduce((map, coach) => {
                    map[coach.coachID] = coach.coachName;
                    return map;
                }, {});
                setCoachMap(coachMap);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchClassData();
    }, [classID]);

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Read Class" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    {loading ? (
                        <p className="text-white">Loading...</p>
                    ) : classItem ? (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-100">{classItem.className}'s Information</h2>
                            <p className="text-gray-400">Class ID: {classItem.classID}</p>
                            <p className="text-gray-400">Coach: {coachMap[classItem.coachID]}</p>
                            <p className="text-gray-400">Sport: {sportMap[classItem.sportID]}</p>
                            <p className="text-gray-400">Age Category: {ageCategoryMap[classItem.ageCategoryID]}</p>
                            <p className="text-gray-400">Term: {termMap[classItem.termID]}</p>
                            <p className="text-gray-400">Days: {classItem.days}</p>
                            <p className="text-gray-400">Timing: {classItem.timing}</p>
                            <p className="text-gray-400">Type: {classItem.type}</p>
                            <p className="text-gray-400">Location: {locationMap[classItem.locationID]}</p>
                        </div>
                    ) : (
                        <p className="text-red-500">Class not found</p>
                    )}
                </motion.div>
                <a href="/superadmin/view-class" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
            </main>
        </div>
    );
};

export default ReadClass;
