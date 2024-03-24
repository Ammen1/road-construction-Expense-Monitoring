import React, { useState, useEffect } from "react";
import { Modal, Table, Button } from "flowbite-react";
import { useSelector } from "react-redux";


const ManagerProjectTable = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableManagers, setAvailableManagers] = useState([]);
    const [availableEmployees, setAvailableEmployees] = useState([]);
  
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/project/managerproject/${currentUser._id}`);
          const data = await response.json();
          console.log(data);
  
          if (response.ok) {
            setProjects(data.projects);
          } else {
            setError(data.message || "Failed to fetch projects");
          }
        } catch (error) {
          setError("Something went wrong while fetching the projects");
        } finally {
          setLoading(false);
        }
      };
  
      fetchProjects();
    }, [currentUser._id]);
    
    useEffect(() => {
        const getManagers = async () => {
        try {
            const res = await fetch("/api/user/getusers");
            const data = await res.json();
            if (res.ok) {
            const managers = data.users.filter((user) => user.isManager);
            setAvailableManagers(managers);
            }
        } catch (error) {
            console.log(error.message);
        }
        };
        getManagers();
    }, []);
    const getEmployees = async () => {
        try {
        const res = await fetch("/api/user/getusers");
        const data = await res.json();
        if (res.ok) {
            const employees = data.users.filter((user) => user.isEmployee);
            setAvailableEmployees(employees);
        }
        } catch (error) {
        console.log(error.message);
        }
    };

    useEffect(() => {
        getEmployees();
      }, []);

    const calculateTotalBudget = (budget) => {
        const { materials, labor, equipment, permits } = budget;
        const totalBudget = materials + labor + equipment + permits;
        return totalBudget;
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
        <Table.HeadCell>project location</Table.HeadCell>
        <Table.HeadCell>team</Table.HeadCell>
        <Table.HeadCell>budget</Table.HeadCell>
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
            <Table.Cell>
                {
                availableEmployees.find(
                (employee) => employee._id === project.employee
                )?.username
                }
            </Table.Cell>
            <Table.Cell>
            {calculateTotalBudget(project.budget)}
            </Table.Cell>
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
            <Table.Cell>{project.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
    </div>
  );
};

export default ManagerProjectTable;
