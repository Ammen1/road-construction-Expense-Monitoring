import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useGlobalContext } from "../context/Context";
import { Card } from 'flowbite-react';

const NotifiContructor = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');
  const { getExpenses, totalBalance, totalIncome, totalExpenses } = useGlobalContext();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/project/getprojects'); // Replace with your backend API endpoint
        if (response.status === 200) {
          setProjects(response.data.projects);
        } else {
          setError('Failed to fetch projects');
        }
      } catch (error) {
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const calculateAvailableFunds = (project) => {
    return project.budget - project.expense;
  };

  const calculateRemainingDays = (project) => {
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const currentDate = new Date();
    const remainingDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return remainingDays;
  };

  const notifyContractor = () => {
    let notificationMessage = '';
    projects.forEach(project => {
      if (project.status !== 'Completed') {
        const currentDate = new Date();
        const projectEndDate = new Date(project.endDate);
        if (currentDate > projectEndDate) {
          notificationMessage += `Project '${project.name}' has not been completed within the timeline set by the contractor.\n`;
        }
      }

      if (project.expense > project.budget) {
        notificationMessage += `Project '${project.name}' has exceeded the budget allocated by the contractor.\n`;
      }
    });

    setNotification(notificationMessage);
  };

  useEffect(() => {
    // Update notification every 5 minutes (adjust interval as needed)
    const interval = setInterval(() => {
      notifyContractor();
    }, 1 * 60 * 100);

    // Cleanup function
    return () => clearInterval(interval);
  }, [projects]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Project Report</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Project Name</th>
              <th className="px-4 py-2">Remaining Days</th>
              <th className="px-4 py-2">Project Status</th>
              <th className="px-4 py-2">Available Funds</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project._id}>
                <td className="border px-4 py-2">{project.name}</td>
                <td className="border px-4 py-2">{calculateRemainingDays(project)}</td>
                <td className="border px-4 py-2">{project.status}</td>
                <td className={`border px-4 py-2 ${calculateAvailableFunds(project) < 0 ? 'text-red-500' : ''}`}>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'ETH'
                  }).format(calculateAvailableFunds(project))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {notification && (
        <Card className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md">
          {notification.split('\n').map((message, index) => (
            <div className=' text-lg border h-20 mt-4 ' key={index}><span className=' mt-20'>{message}</span></div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default NotifiContructor;
