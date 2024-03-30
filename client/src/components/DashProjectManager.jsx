import React, { useState, useEffect } from "react";
import { Table } from 'flowbite-react';
import { useSelector } from "react-redux";
import axios from 'axios';

const ManagerProjectTable = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/project/managerproject/${currentUser._id}`);
        setProjects(response.data.projects);
      } catch (error) {
        setError("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentUser._id]);

  const handleStatusUpdate = async (projectId, newStatus) => {
    try {
      const response = await axios.put(`/api/project/projects/${projectId}/status`, { status: newStatus });
      if (response.data.success) {
        // Update the status of the project in the state
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project._id === projectId ? { ...project, status: newStatus } : project
          )
        );
      } else {
        setError(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      setError('Something went wrong while updating the status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="table-auto  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <Table hoverable className="shadow-md mt-6 w-full">
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Location</Table.HeadCell>
          <Table.HeadCell>Team</Table.HeadCell>
          <Table.HeadCell>Budget</Table.HeadCell>
          <Table.HeadCell>Start Date</Table.HeadCell>
          <Table.HeadCell>End Date</Table.HeadCell>
          <Table.HeadCell>Location</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
 
        </Table.Head>
        <Table.Body>
          {projects.map((project) => (
            <Table.Row key={project._id}>
              <Table.Cell>{project.name}</Table.Cell>
              <Table.Cell>{project.location}</Table.Cell>
              <Table.Cell>{project.employee.username}</Table.Cell>
              <Table.Cell>{project.budget}</Table.Cell>
              <Table.Cell>
                {new Intl.DateTimeFormat("am-ET", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(project.startDate))}
              </Table.Cell>
              <Table.Cell>
                {new Intl.DateTimeFormat("am-ET", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(project.endDate))}
              </Table.Cell>
              <Table.Cell>{project.location}</Table.Cell>
              <Table.Cell>
                <select onChange={(e) => handleStatusUpdate(project._id, e.target.value)}>
                  <option value="Pending" selected={project.status === 'Pending'}>Pending</option>
                  <option value="InProgress" selected={project.status === 'InProgress'}>In Progress</option>
                  <option value="Completed" selected={project.status === 'Completed'}>Completed</option>
                </select>
              </Table.Cell>
    
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ManagerProjectTable;
