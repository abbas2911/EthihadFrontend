import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Document, Page, Text, View, Image, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import axios from 'axios';
import Header from '../../../components/common/parents/Header';
import bgImage from '../../../assets/images/Certificate.png';

// Created Stylesheet
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 9,
        padding: 0,
        backgroundColor: 'white',
        position: 'relative',
    },
    backgroundImage: {
        width: '100%', // Make the image fill the full width
        height: 'auto', // Automatically adjust height to maintain aspect ratio
        position: 'absolute',
        top: 0,
        left: 0,
    },
    studentName: {
        position: 'absolute',
        top: 310, // Adjust these values based on the desired position
        left: 490,
        fontSize: 24,
        color: 'black',
    },
    coachName: {
        position: 'absolute',
        top: 470,
        left: 333,
        fontSize: 17,
        color: 'black',
    },
    className: {
        position: 'absolute',
        top: 200,
        left: 50,
        fontSize: 24,
        color: 'black',
    },
});

const PdfCertificate = () => {
    const { studentID, coachID, classID } = useParams();
    const [certificateData, setCertificateData] = useState(null);

    useEffect(() => {
        const fetchCertificateData = async () => {
            try {
                const response = await axios.get(`https://ethihad-backend-server-4565c742307a.herokuapp.com/api/parent/get-certificate-data/${studentID}/${coachID}/${classID}`);
                setCertificateData(response.data);
            } catch (error) {
                console.error('Error fetching certificate data:', error);
            }
        };
        fetchCertificateData();
    }, [studentID, coachID, classID]);

    // Actual Generated PDF
    const CertificateDocument = () => {
        return (
            <Document>
                <Page style={styles.page} size="A4" orientation="landscape">
                    <Image src={bgImage} style={styles.backgroundImage} />
                    
                    <Text style={styles.studentName}>{certificateData.studentFullName}</Text>
                    <Text style={styles.coachName}>{certificateData.coachFullName}</Text>
                </Page>
            </Document>
        );
    };

    if (!certificateData) return <div>Loading...</div>;

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Preview & Download Certificate" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Certificate Preview</h2>
                    </div>

                    <PDFViewer width="100%" height="600">
                        <CertificateDocument />
                    </PDFViewer>

                </motion.div>
                <a href="/parent/view-certificate" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4">Back</a>
            </main>
        </div>
    );
};

export default PdfCertificate;
