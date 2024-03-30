import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useSelector } from 'react-redux';

const PaymentComponent = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({ tin: '', name: '', amount: '', userId: '', projectName: '', projectId: '' });
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchPayments();
    fetchApplications();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/payment/payments');
      setPayments(response.data.payments || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`/api/supplier/applications?userId=${currentUser}`);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({ ...newPayment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/payment/payments/create', newPayment);
      setPayments(prevPayments => [...prevPayments, response.data]);
      setNewPayment({ tin: '', name: '', amount: '', userId: '', projectName: '', projectId: '' });
      window.alert('Payment created successfully!');
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const handleSelectProject = async (projectId) => {
    try {
      const selectedApplication = applications.find(application => application.project === projectId);
      if (selectedApplication) {
        const { name: projectName } = selectedApplication;
        setNewPayment({ ...newPayment, projectName, projectId });
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  return (
    <div className='text-white w-full'>
      <h2 className='text-2xl mb-4'>Request Payments</h2>
      <form className='gap-8' onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
          <TextInput type="text" name="tin" value={newPayment.tin} onChange={handleInputChange} placeholder="TIN" required />
          <TextInput type="text" name="name" value={newPayment.name} onChange={handleInputChange} placeholder="Name" required />
          <TextInput type="text" name="amount" value={newPayment.amount} onChange={handleInputChange} placeholder="Amount" required />
          <div className='grid grid-cols-1 md:grid-cols-1 gap-4 bg-black'>
            <label>Select Project:</label>
            <select name="project" value={newPayment.projectId} onChange={(e) => handleSelectProject(e.target.value)}>
              <option value="">Select Project</option>
              {applications.map(application => (
                <option key={application._id} value={application.project}>
                  {application.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button gradientDuoTone="purpleToPink" className='mt-12' type="submit">Request Payment</Button>
      </form>
    </div>
  );
};

export default PaymentComponent;
