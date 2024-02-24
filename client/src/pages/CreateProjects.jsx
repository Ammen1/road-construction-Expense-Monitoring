// react/components/CreateProject.js

import { Button, TextInput, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
    location: "",
    tasks: [
      {
        name: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        status: "NotStarted",
      },
    ],
  });
  const [publishError, setPublishError] = useState(null);
  const [availableManagers, setAvailableManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);

  const navigate = useNavigate();

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

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...formData.tasks];
    updatedTasks[index][field] = value;
    setFormData({ ...formData, tasks: updatedTasks });
  };

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [
        ...formData.tasks,
        {
          name: "",
          description: "",
          status: "NotStarted",
        },
      ],
    });
  };

  const removeTask = (index) => {
    const updatedTasks = [...formData.tasks];
    updatedTasks.splice(index, 1);
    setFormData({ ...formData, tasks: updatedTasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validTasks = formData.tasks.filter(
        (task) => task.name.trim() !== ""
      );
      const projectDataWithManager = {
        ...formData,
        manager: selectedManager,
        tasks: validTasks,
      };

      console.log("Project Data:", projectDataWithManager);

      const res = await fetch("/api/create/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectDataWithManager),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error Response:", data);
        setPublishError(data.message || "Failed to create the project");
        return;
      }

      setPublishError(null);
      navigate(`/`);
    } catch (error) {
      console.error("Error:", error);
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Create a Project
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Project Name"
            required
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextInput
            type="text"
            placeholder="Project Description"
            required
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <TextInput
          type="number"
          placeholder="Budget"
          required
          id="budget"
          value={formData.budget}
          onChange={(e) =>
            setFormData({ ...formData, budget: parseFloat(e.target.value) })
          }
        />
        <TextInput
          type="text"
          placeholder="location"
          required
          id="lacation"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
        />
        <TextInput
          type="date"
          placeholder="Start Date"
          required
          id="startDate"
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
        />

        <TextInput
          type="date"
          placeholder="End Date"
          required
          id="endDate"
          value={formData.endDate}
          onChange={(e) =>
            setFormData({ ...formData, endDate: e.target.value })
          }
        />

        <Select
          className="text-white"
          label="Select Project Manager"
          id="manager"
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
        >
          <option value="" disabled>
            Choose a Manager
          </option>
          {availableManagers.map((manager) => (
            <option key={manager._id} value={manager._id}>
              {manager.username}
            </option>
          ))}
        </Select>
        {formData.tasks.map((task, index) => (
          <div key={index} className="flex flex-col gap-4">
            <TextInput
              type="text"
              placeholder="Task Name"
              required
              value={task.name}
              onChange={(e) => handleTaskChange(index, "name", e.target.value)}
            />
            <TextInput
              type="text"
              placeholder="Task Description"
              value={task.description}
              onChange={(e) =>
                handleTaskChange(index, "description", e.target.value)
              }
            />
            <TextInput
              type="date"
              placeholder="Task dueDate"
              value={task.dueDate}
              onChange={(e) =>
                handleTaskChange(index, "dueDate", e.target.value)
              }
            />

            <Button type="button" onClick={() => removeTask(index)}>
              Remove Task
            </Button>
          </div>
        ))}

        <Button type="button" onClick={addTask}>
          Add Task
        </Button>

        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>

        {publishError && <p className="text-red-500">{publishError}</p>}
      </form>
    </div>
  );
}
