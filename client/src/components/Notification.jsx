import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'flowbite-react';
import { useSelector } from "react-redux";

export default function Notification() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [errorTasks, setErrorTasks] = useState(null);
  const [isNewTaskAdded, setIsNewTaskAdded] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoadingTasks(true);
        const response = await axios.get('/api/task');
        const prevTasksLength = tasks.length; // Get length of tasks before updating
        setTasks(response.data.tasks);
        setErrorTasks(null); // Clear any previous errors on successful fetch
        const newTasksLength = response.data.tasks.length; // Get length of tasks after updating
        // Check if new task has been added
        if (newTasksLength > prevTasksLength) {
          setIsNewTaskAdded(true);
          // Reset isNewTaskAdded after 3 seconds
          setTimeout(() => {
            setIsNewTaskAdded(false);
          }, 3000);
        }
      } catch (error) {
        setErrorTasks(error.message);
      } finally {
        setLoadingTasks(false);
      }
    };

    // Fetch tasks initially and then every 3 seconds
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);

    // Clean up interval to avoid memory leaks
    return () => clearInterval(interval);
  }, []);

  // Render error message if there's an error fetching tasks
  if (error || errorTasks) {
    return <p>Error: {error || errorTasks}</p>;
  }

  // Filter tasks assigned to the current user
  const tasksAssignedToCurrentUser = tasks.filter(task => task.team.some(user => user.username === currentUser.username));

  return (
    <div className="flex">
      <h6 className=" mt-2">
        <h2 className="text-lg font-semibold mb-2 text-center">{tasksAssignedToCurrentUser.length}</h2>
        {isNewTaskAdded && <p className="text-sm text-green-500 text-center">New task added to you</p>}
      </h6>
    </div>
  );
}
