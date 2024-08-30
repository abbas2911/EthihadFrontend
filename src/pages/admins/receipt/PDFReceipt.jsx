import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Document, Page, Text, View, Image, StyleSheet, PDFViewer, pdf } from '@react-pdf/renderer';
import axios from 'axios';
import Header from '../../../components/common/admins/Header';
import bgImage from '../../../assets/images/Ethihad_Logo.jpeg';


{/*Created Stylesheet*/}
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 9,
        padding: 20,
        backgroundColor: 'white',
        color: 'black',
    },
    logo: {
        width: 80,
        position: 'absolute',
        top: 15,
        right: 15,
    },
    invoiceTitle: {
        fontSize: 20,
        fontWeight: 700,
        position: 'absolute',
        top: 15,
        left: 15,
    },
    invoiceDetails: {
        marginTop: 70,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    billToFrom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    billColumn: {
        width: '45%',
    },
    subtitle: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    table: {
        width: "100%",
        marginBottom: 25,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingBottom: 5,
        paddingTop: 5,
    },
    tableCol: {
        width: "20%",
        paddingVertical: 8,
    },
    tableHeader: {
        backgroundColor: "#F5F5F5",
        color: 'black',
        fontWeight: "bold",
    },
    paymentSummary: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop: 20,
        fontSize: 9,
    },
    total: {
        marginTop: 10,
        fontSize: 9,
        fontWeight: "bold",
        textAlign: 'right',
        color: 'black',
        borderTopWidth: 1,
        borderTopColor: 'black',
        paddingTop: 5,
    },
    bankAndTerms: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    bankDetails: {
        width: '45%',
        fontSize: 7,
        lineHeight: 1.5,
    },
    terms: {
        width: '45%',
        fontSize: 7,
        lineHeight: 1.5,
    },
    signatures: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
    },
    signatureBox: {
        width: "45%",
        borderTopWidth: 1,
        borderTopColor: "#333",
        textAlign: 'center',
        paddingTop: 10,
    },
    note: {
        marginTop: 30,
        fontSize: 7,
        textAlign: 'center',
        color: 'black',
    },
});

const PdfReceipt = () => {
    const { receiptID } = useParams();
    const [receiptData, setReceiptData] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        axios.get(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/readReceiptWithStudent/${receiptID}`)
            .then(response => setReceiptData(response.data))
            .catch(error => console.error('Error fetching receipt data:', error));
    }, [receiptID]);

    if (!receiptData) return <div>Loading...</div>;

    const ReceiptDocument = () => (
        <Document>
            <Page style={styles.page}>
                <Image src={bgImage} style={styles.logo} />
                <Text style={styles.receiptTitle}>Receipt</Text>

                <View style={styles.receiptDetails}>
                    <View>
                        <Text>Receipt Number: {receiptData.receiptID}</Text>
                        <Text>Payment Date: {receiptData.paymentDate}</Text>
                    </View>
                </View>

                <View style={styles.billToFrom}>
                    <View style={styles.billColumn}>
                        <Text style={styles.subtitle}>Receipt From:</Text>
                        <Text>Academy Name</Text>
                        <Text>123 Academy Street</Text>
                        <Text>City, State, ZIP</Text>
                        <Text>Phone: (123) 456-7890</Text>
                        <Text>Email: academy@example.com</Text>
                    </View>
                    <View style={styles.billColumn}>
                        <Text style={styles.subtitle}>Receipt To:</Text>
                        <Text>{receiptData.studentName}</Text>
                        <Text>{receiptData.studentPhone}</Text>
                        <Text>{receiptData.studentEmail}</Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <Text style={styles.subtitle}>Receipt Details:</Text>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCol, { fontWeight: 'bold' }]}>Invoice ID</Text>
                        <Text style={[styles.tableCol, { fontWeight: 'bold' }]}>Amount AED</Text>
                        <Text style={[styles.tableCol, { fontWeight: 'bold' }]}>Payment Mode</Text>
                        <Text style={[styles.tableCol, { fontWeight: 'bold' }]}>Description</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>{receiptData.invoiceID}</Text>
                        <Text style={styles.tableCol}>{receiptData.amount}</Text>
                        <Text style={styles.tableCol}>{receiptData.paymentMode}</Text>
                        <Text style={styles.tableCol}>{receiptData.description}</Text>
                    </View>
                </View>

                <View style={styles.paymentSummary}>
                    <Text>Payment Summary:</Text>
                    <Text>Total Amount: {receiptData.amount.toFixed(2)} AED</Text>
                </View>

                <Text style={styles.note}>This is a computer-generated receipt.</Text>
            </Page>
        </Document>
    );

    const handleSendEmail = async () => {
        try {
            const pdfBlob = await pdf(<ReceiptDocument />).toBlob();
            const pdfBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(pdfBlob);
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
            });

            await axios.post('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/sendemail', {
                pdf: pdfBase64,
                receiptID: receiptID,
            });

            setAlertMessage('Email sent successfully!');
            setAlertSeverity('success');
            setOpenAlert(true);
        } catch (error) {
            console.error('Error sending email:', error);
            setAlertMessage('Failed to send email');
            setAlertSeverity('error');
            setOpenAlert(true);
        }
    };

    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Preview & Download PDF" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-100">Receipt Preview</h2>
                    </div>

                    <PDFViewer width="100%" height="600">
                        <ReceiptDocument />
                    </PDFViewer>

                    <button
                        onClick={handleSendEmail}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                    >
                        Send via Email
                    </button>
                </motion.div>
                <a href="/admin/view-receipt" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4">Back</a>
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

export default PdfReceipt;
