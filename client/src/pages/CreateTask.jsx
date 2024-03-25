import React, { useState, useEffect } from "react";
import { Button, Label, TextInput, Select } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    team: "",
    stage: "",
    date: "",
    priority: "",
    assets: [],
    project: "",
    activities: [],
    subTasks: [],
    isTrashed: "false",
  });
  const [publishError, setPublishError] = useState(null);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
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
    getEmployees();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/project/getprojects?userId=${currentUser._id}`);
        const data = await res.json();
  
        if (Array.isArray(data.projects)) {
          setUserProjects(data.projects); 
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } 
    };
  
    if (currentUser && currentUser.isManager) {
      fetchProjects();
    }
  }, [currentUser, currentUser._id]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error Response:", data);
        setPublishError(data.message || "Failed to create the task");
        return;
      }

      setPublishError(null);
      navigate(`/dashboard?tab=projects`);
      setFormData({
        title: "",
        team: "",
        stage: "",
        date: "",
        priority: "",
        assets: [],
        project: "",
        activities: [],
        subTasks: [],
        isTrashed: "false",
      });
    } catch (error) {
      console.error("Error:", error);
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen lg:mt-10">
      <div className="flex flex-col max-w-3xl gap-5 p-3 mx-auto md:flex-row md:items-center">
        {/* Left */}
        <div className="items-center justify-center flex-1 text-center ">
          <Link to="/" className="text-4xl font-bold dark:text-white">
            <span className="px-2 py-1 text-center text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Road Con
            </span>
            Monitor
          </Link>
          <p className="mt-5 text-md">
            This is a road construction Expense Monitoring System for a
            contractor project. You can create project up with all fields.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Title" />
              <TextInput
                type="text"
                placeholder="Enter task title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
          
            <Label value="Employee" />
            <Select
              className="text-white"
              label="Select employee"
              id="employee"
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
            >
              <option value="" disabled>
                Choose an employee
              </option>
              {availableEmployees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.username}
                </option>
              ))}
            </Select>
            <Label value="Project" />
            <Select
              className="text-white"
              label="Select Project"
              id="project"
              value={formData.project}
              onChange={(e) =>
                setFormData({ ...formData, project: e.target.value })
              }
            >
              <option value="" disabled>
                Choose an Project
              </option>
              {userProjects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </Select>
              <Label value="Stage" />
              <Select
                id="stage"
                value={formData.stage}
                onChange={(e) =>
                  setFormData({ ...formData, stage: e.target.value })
                }
              >
                <option value="">Select Stage</option>
                <option value="todo">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </Select>          
              <Label value="Date" />
              <TextInput
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />          
              <Label value="Priority" />
              <Select
                id="priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>          
              <Label value="Assets" />
              <TextInput
                type="text"
                placeholder="Enter task assets"
                value={formData.assets}                onChange={(e) =>
                  setFormData({ ...formData, assets: e.target.value })
                }
              />
            </div>        
            <Label value="Trashed" />
            <Select
              id="isTrashed"
              value={formData.isTrashed}
              onChange={(e) =>
                setFormData({ ...formData, isTrashed: e.target.value })
              }
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </Select>

            <Button type="submit" gradientDuoTone="purpleToPink">
              Create Task
            </Button>
            {publishError && (
              <p className="text-red-500">{publishError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;

               
