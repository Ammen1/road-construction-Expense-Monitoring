import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Table, Button } from "flowbite-react";

const ApprovePayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/payment/payments');
      setPayments(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Error fetching payments. Please try again later.');
      setLoading(false);
    }
  };

  const handleApprovePayment = async (paymentId) => {
    try {
      await axios.put(`/api/payment/payments/${paymentId}/approve`);
      fetchPayments(); // Refresh payments after approval
    } catch (error) {
      console.error('Error approving payment:', error);
      setError('Error approving payment. Please try again later.');
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      await axios.delete(`/api/payment/payments/${paymentId}`);
      fetchPayments(); 
    } catch (error) {
      console.error('Error deleting payment:', error);
      setError('Error deleting payment. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">All Payments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : payments.length > 0 ? (
        <Table hoverable className="shadow-md mt-6 w-full">
          <Table.Head>
            <Table.HeadCell className="px-4 py-2">TIN</Table.HeadCell>
            <Table.HeadCell className="px-4 py-2">Name</Table.HeadCell>
            <Table.HeadCell className="px-4 py-2">Amount</Table.HeadCell>
            <Table.HeadCell className="px-4 py-2">project</Table.HeadCell>
            <Table.HeadCell className="px-4 py-2">Approved</Table.HeadCell>
            <Table.HeadCell className="px-4 py-2">Actions</Table.HeadCell>
            <Table.HeadCell className="px-4 py-2">Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {payments.map(payment => (
              <Table.Row key={payment._id} className="border-b">
                <Table.Cell className="px-4 py-2">{payment.tin}</Table.Cell>
                <Table.Cell className="px-4 py-2">{payment.name}</Table.Cell>
                <Table.Cell className="px-4 py-2">{payment.amount}</Table.Cell>
                <Table.Cell className="px-4 py-2">{payment.project}</Table.Cell>
                <Table.Cell className="px-4 py-2">{payment.approved ? 'Yes' : 'No'}</Table.Cell>
                <Table.Cell className="px-4 py-2">
                  {!payment.approved && (
                    <>
                      <Button
                        onClick={() => handleApprovePayment(payment._id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded mr-2"
                      >
                        Approve
                      </Button>
                     
                    </>
                  )}

                </Table.Cell>
                <Table.Cell> 
                  <Button
                        onClick={() => handleDeletePayment(payment._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold rounded"
                      >
                        Delete
                  </Button></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p>No payments found!</p>
      )}
    </div>
  );
};

export default ApprovePayment;
