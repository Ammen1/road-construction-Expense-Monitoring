import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Modal, Table, Button } from 'flowbite-react';

export default function DashApproveSupplier() {
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
        const response = await axios.get(`/api/supplier/applications`);
        console.log(response.data);
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Error fetching applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleEditApplication = (applicationId) => {
    // Handle edit action here, e.g., navigate to edit page
  };

  const handleApproveApplication = async (applicationId) => {
    try {
      setLoading(true);
      await axios.put(`/api/supplier/application/${applicationId}`, { isActive: true });
      // Assuming the API updates the isActive field
      const updatedApplications = applications.map(app => {
        if (app._id === applicationId) {
          return { ...app, isActive: true };
        }
        return app;
      });
      setApplications(updatedApplications);
    } catch (error) {
      console.error('Error approving application:', error);
      setError('Error approving application. Please try again later.');
    } finally {
      setLoading(false);
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
              <Table.HeadCell>TIN Number</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Phone</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
              <Table.HeadCell>ServicesProvided</Table.HeadCell>
              <Table.HeadCell>Project</Table.HeadCell>
              <Table.HeadCell>Supplier</Table.HeadCell>
              <Table.HeadCell>isActive</Table.HeadCell>
              <Table.HeadCell>ProjectsCompleted</Table.HeadCell>
              <Table.HeadCell>Approve</Table.HeadCell>
              <Table.HeadCell>isActive</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
            {applications.map((application) => (
            <Table.Row key={application._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{new Date(application.createdAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{application.tinNumber}</Table.Cell>
                <Table.Cell>{application.name}</Table.Cell>
                <Table.Cell>{application.email}</Table.Cell>
                <Table.Cell>{application.phone}</Table.Cell>
                <Table.Cell>{application.city}</Table.Cell>
                <Table.Cell>{application.servicesProvided}</Table.Cell>
                <Table.Cell>{application.project}</Table.Cell>
                <Table.Cell>{application.user}</Table.Cell>
                <Table.Cell>{application.isActive ? 'Yes' : 'No'}</Table.Cell>
                <Table.Cell>{application.projectsCompleted}</Table.Cell>
                <Table.Cell>{application.isActive ? 'Yes' : 'No'}</Table.Cell>
                  <Table.Cell>
                    <Button color="success" onClick={() => handleApproveApplication(application._id)}>
                      Approve
                    </Button>
                  </Table.Cell>
                <Table.Cell>
                <Button color="info" onClick={() => handleEditApplication(application._id)}>Edit</Button>
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
              <Button color="danger" >
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

                
               