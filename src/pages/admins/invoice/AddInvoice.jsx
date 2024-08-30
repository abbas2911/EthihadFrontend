import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../../../components/common/admins/Header';

const AddInvoice = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [details, setDetails] = useState({ durations: [], items: [] });
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [invoiceDurations, setInvoiceDurations] = useState([]);
  const [vat, setVat] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    axios.get('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/fetchStudentID')
      .then(response => setStudents(response.data))
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  const handleStudentChange = (event) => {
    const studentID = event.target.value;
    setSelectedStudent(studentID);

    axios.get(`https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/fetchStudentDetails/${studentID}`)
      .then(response => setDetails(response.data))
      .catch(error => console.error('Error fetching details:', error));
  };

  const handleItemChange = (index, event) => {
    const { name, value } = event.target;
    const newInvoiceItems = [...invoiceItems];
    newInvoiceItems[index][name] = value;

    if (name === 'itemID') {
      const selectedItem = details.items.find(item => item.itemID.toString() === value);
      if (selectedItem) {
        newInvoiceItems[index].rate_per = selectedItem.price || 0;
        newInvoiceItems[index].description = selectedItem.itemDescription || '';
      }
    }

    newInvoiceItems[index].total_amount = newInvoiceItems[index].rate_per * newInvoiceItems[index].quantity;
    setInvoiceItems(newInvoiceItems);
    calculateTotals(newInvoiceItems, invoiceDurations);
  };

  const handleDurationChange = (index, event) => {
    const { name, value } = event.target;
    const newInvoiceDurations = [...invoiceDurations];
    newInvoiceDurations[index][name] = value;

    if (name === 'durationID') {
      const selectedDuration = details.durations.find(duration => duration.durationID.toString() === value);
      if (selectedDuration) {
        newInvoiceDurations[index].rate_per = selectedDuration.price || 0;
        newInvoiceDurations[index].description = selectedDuration.durationDescription || '';
      }
    }

    newInvoiceDurations[index].total_amount = newInvoiceDurations[index].rate_per * newInvoiceDurations[index].quantity;
    setInvoiceDurations(newInvoiceDurations);
    calculateTotals(invoiceItems, newInvoiceDurations);
  };

  const addItemRow = () => setInvoiceItems([...invoiceItems, { itemID: '', rate_per: 0, quantity: 1, total_amount: 0, description: '' }]);

  const addDurationRow = () => setInvoiceDurations([...invoiceDurations, { durationID: '', rate_per: 0, quantity: 1, total_amount: 0, description: '' }]);

  const calculateTotals = (items, durations) => {
    const itemsTotal = items.reduce((acc, item) => acc + (item.total_amount || 0), 0);
    const durationsTotal = durations.reduce((acc, duration) => acc + (duration.total_amount || 0), 0);
    const subtotal = itemsTotal + durationsTotal;
    const vatAmount = subtotal * 0.05;
    const grandTotal = subtotal + vatAmount;

    setVat(vatAmount);
    setGrandTotal(grandTotal);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token'); // Get token from localStorage

    const invoiceData = {
      studentID: selectedStudent,
      grand_amount: grandTotal,
      dueDate: new Date(),
      paid: false,
      items: invoiceItems,
      durations: invoiceDurations,
    };

    axios.post('https://abbas-test-project-4dc6504935e5.herokuapp.com/api/admin/insertInvoice', invoiceData, {
      headers: {
        'Authorization': `Bearer ${token}` // Add token to Authorization header
      }
    })
    .then(response => {
      setAlertMessage('Invoice created successfully');
      setAlertSeverity('success');
      setOpenAlert(true);
    })
    .catch(error => {
      console.error('Error creating invoice:', error);
      setAlertMessage('Error creating invoice');
      setAlertSeverity('error');
      setOpenAlert(true);
    });
  };

  const handleCloseAlert = (reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setOpenAlert(false);
  };  

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Add Invoice" />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <motion.div
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
          >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Invoice Management</h2>
                <p className="text-xs mt-1 text-gray-400">Fill in all the fields to create an invoice.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-100">Select Student:</label>
                  <select
                    onChange={handleStudentChange}
                    value={selectedStudent || ''}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                  >
                    <option value="">Select a student</option>
                    {students.map(student => (
                      <option key={student.studentID} value={student.studentID}>
                        {student.firstName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-100">Items</h3>
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="text-gray-300">
                        <th className="border-b border-gray-700 px-4 py-2">Item</th>
                        <th className="border-b border-gray-700 px-4 py-2">Rate per</th>
                        <th className="border-b border-gray-700 px-4 py-2">Quantity</th>
                        <th className="border-b border-gray-700 px-4 py-2">Total Amount</th>
                        <th className="border-b border-gray-700 px-4 py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceItems.map((item, index) => (
                        <tr key={index} className="text-gray-100">
                          <td className="border-b border-gray-700 px-4 py-2">
                            <select
                              name="itemID"
                              value={item.itemID}
                              onChange={(e) => handleItemChange(index, e)}
                              className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                              <option value="">Select an item</option>
                              {details.items.map(detailItem => (
                                <option key={detailItem.itemID} value={detailItem.itemID}>
                                  {detailItem.itemName}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="border-b border-gray-700 px-4 py-2">
                            <input
                              type="number"
                              name="rate_per"
                              value={item.rate_per}
                              onChange={(e) => handleItemChange(index, e)}
                              placeholder="Rate per"
                              className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                          </td>
                          <td className="border-b border-gray-700 px-4 py-2">
                            <input
                              type="number"
                              name="quantity"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, e)}
                              placeholder="Quantity"
                              className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                          </td>
                          <td className="border-b border-gray-700 px-4 py-2">
                            {item.total_amount}
                          </td>
                          <td className="border-b border-gray-700 px-4 py-2">
                            {item.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Item
                  </button>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-100">Durations</h3>
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="text-gray-300">
                        <th className="border-b border-gray-700 px-4 py-2">Duration</th>
                        <th className="border-b border-gray-700 px-4 py-2">Rate per</th>
                        <th className="border-b border-gray-700 px-4 py-2">Quantity</th>
                        <th className="border-b border-gray-700 px-4 py-2">Total Amount</th>
                        <th className="border-b border-gray-700 px-4 py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceDurations.map((duration, index) => (
                        <tr key={index} className="text-gray-100">
                          <td className="border-b border-gray-700 px-4 py-2">
                            <select
                              name="durationID"
                              value={duration.durationID}
                              onChange={(e) => handleDurationChange(index, e)}
                              className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            >
                              <option value="">Select a duration</option>
                              {details.durations.map(detailDuration => (
                                <option key={detailDuration.durationID} value={detailDuration.durationID}>
                                  {detailDuration.durationName}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="border-b border-gray-700 px-4 py-2">
                            <input
                              type="number"
                              name="rate_per"
                              value={duration.rate_per}
                              onChange={(e) => handleDurationChange(index, e)}
                              placeholder="Rate per"
                              className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                          </td>
                          <td className="border-b border-gray-700 px-4 py-2">
                            <input
                              type="number"
                              name="quantity"
                              value={duration.quantity}
                              onChange={(e) => handleDurationChange(index, e)}
                              placeholder="Quantity"
                              className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-2 text-gray-900"
                            />
                          </td>
                          <td className="border-b border-gray-700 px-4 py-2">
                            {duration.total_amount}
                          </td>
                          <td className="border-b border-gray-700 px-4 py-2">
                            {duration.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={addDurationRow}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Duration
                  </button>
                </div>
                
                <div className="text-sm font-medium text-gray-100">
                  <p>VAT: {vat.toFixed(2)}</p>
                  <p>Grand Total: {grandTotal.toFixed(2)}</p>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Submit Invoice
                  </button>
                </div>
              </form>
          </motion.div>
          <a href="/admin/view-invoice" className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back</a>
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

export default AddInvoice;