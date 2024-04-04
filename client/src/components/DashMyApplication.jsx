import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Modal, Table, Button } from 'flowbite-react';

export default function DashMyApplication() {
  const { currentUser } = useSelector((state) => state.user);
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [applicationIdToDelete, setApplicationIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/supplier/applications?userId=${currentUser}`);
        const filteredApplications = response.data.filter(application => application.user === currentUser._id);
        setApplications(filteredApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Error fetching applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchApplications();
  }, [currentUser]); // Add currentUser as a dependency
  

  const handleEditApplication = (applicationId) => {
    // Handle edit action here, e.g., navigate to edit page
    console.log('Editing application with ID:', applicationId);
  };

  const handleDeleteConfirmation = (applicationId) => {
    setShowModal(true);
    setApplicationIdToDelete(applicationId);
  };

  const handleDeleteApplication = async () => {
    try {
      await axios.delete(`/api/supplier/application
      /${applicationIdToDelete}`);
      setApplications(applications.filter(app => app._id !== applicationIdToDelete));
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting application:', error);
      setError('Error deleting application. Please try again later.');
    }
  };

  return (
    <div className="table-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {applications && applications.length > 0 ? (
        <>
          <Table hoverable className="shadow-md mt-6 w-full">
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Phone</Table.HeadCell>
              <Table.HeadCell>Project</Table.HeadCell>
              <Table.HeadCell>Approved</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {applications.map((application) => (
                <Table.Row key={application._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(application.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{application.name}</Table.Cell>
                  <Table.Cell>{application.email}</Table.Cell>
                  <Table.Cell>{application.phone}</Table.Cell>
                  <Table.Cell>{application.project }</Table.Cell>
                  <Table.Cell>{application.isActive ? 'Yes' : 'No'}</Table.Cell>
                  <Table.Cell>
                    <Button color="info" onClick={() => handleEditApplication(application._id)}>Edit</Button>
                    <Button color="danger" onClick={() => handleDeleteConfirmation(application._id)}>Delete</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <p>No applications found!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this application?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="danger" className=' bg-red-500' onClick={handleDeleteApplication}>
                Yes, delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
