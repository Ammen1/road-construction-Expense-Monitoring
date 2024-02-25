import { Alert, Button, Select, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CreateProject from "./CreateProjects";
import { Link } from "react-router-dom";

export default function UpdatePost() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: {
      materials: "",
      labor: "",
      equipment: "",
      permits: "",
      other: "",
    },
    // endDate: "",
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
  const { projectId } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [availableManagers, setAvailableManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);

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

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(
          `/api/project/getprojects?projectId=${projectId}`
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.projects[0]);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [projectId]);

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
      const res = await fetch(
        `/api/project/updateproject/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/dashboard?tab=projects`);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <div className="min-h-screen mt-20 lg:mr-44">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1 lg:mb-44 ">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Road Con
            </span>
            Monitor
          </Link>
          <p className="text-md mt-5">
            This is a road construction Expense Monitoring System for a
            contractor project. You can create project up with all fields .
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="name" />
              <TextInput
                type="text"
                placeholder="name"
                required
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Label value="description" />
              <TextInput
                type="text"
                placeholder="description"
                required
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              {/* <Label value="lacation" />
              <TextInput
                type="text"
                placeholder="location"
                required
                id="lacation"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              /> */}
              <Label value="badget for equipment" />
              <TextInput
                type="number"
                placeholder="equipment"
                id="equipment"
                value={formData.budget.equipment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: {
                      ...formData.budget,
                      equipment: parseFloat(e.target.value),
                    },
                  })
                }
              />
              <Label value="budget for materials" />
              <TextInput
                type="number"
                placeholder="materials"
                required
                id="materials"
                value={formData.budget.materials}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: {
                      ...formData.budget,
                      materials: parseFloat(e.target.value),
                    },
                  })
                }
              />
              <Label value="budget for labor" />
              <TextInput
                type="number"
                placeholder="Labor"
                id="labor"
                value={formData.budget.labor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: {
                      ...formData.budget,
                      labor: parseFloat(e.target.value),
                    },
                  })
                }
              />
              {/* <Label value="To end date" />
              <TextInput
                type="date"
                placeholder="end date"
                required
                id="endDate"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              /> */}
            </div>
            <Label value="manager" />
            <Select
              className="text-white"
              label="select manager"
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
                <Label value="task" />
                <TextInput
                  type="text"
                  placeholder="task name"
                  required
                  value={task.name}
                  onChange={(e) =>
                    handleTaskChange(index, "name", e.target.value)
                  }
                />
                <Label value="description" />
                <TextInput
                  type="text"
                  placeholder="description"
                  value={task.description}
                  onChange={(e) =>
                    handleTaskChange(index, "description", e.target.value)
                  }
                />
                {/* <Label value="date" />
                <TextInput
                  type="date"
                  placeholder="due date"
                  value={task.dueDate}
                  onChange={(e) =>
                    handleTaskChange(index, "dueDate", e.target.value)
                  }
                /> */}

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
      </div>
    </div>
  );
}
