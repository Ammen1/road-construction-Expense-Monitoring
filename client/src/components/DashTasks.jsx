import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'flowbite-react';
import { useSelector } from "react-redux";

const TasksComponent = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingTask, setLoadingTask] = useState(false);
  const [errorTasks, setErrorTasks] = useState(null);
  const [errorTask, setErrorTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoadingTasks(true);
        const response = await axios.get('/api/task');
        setTasks(response.data.tasks);
      } catch (error) {
        setErrorTasks(error.message);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, []);

  const handleGetTask = async (taskId) => {
    try {
      setLoadingTask(true);
      const response = await axios.get(`/api/task/${taskId}`);
      setTask(response.data);
    } catch (error) {
      setErrorTask(error.message);
    } finally {
      setLoadingTask(false);
    }
  };

  // Render tasks only if currentUser is authenticated
  if (!currentUser.isEmployee || loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-wrap -mx-4">
      {loadingTasks && <p>Loading tasks...</p>}
      {errorTasks && <p>Error fetching tasks: {errorTasks}</p>}
      {tasks.map((task, index) => (
        <div key={task._id} className="w-full px-4 mb-8 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
          <Card className="overflow-hidden bg-white rounded-lg shadow-lg task-card">
            <div className="p-6">
              <h4 className="mb-2 text-lg font-semibold">{task.title}</h4>
              <p className="text-sm text-gray-600">Date: {new Date(task.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Priority: {task.priority}</p>
              <p className="text-sm text-gray-600">Stage: {task.stage}</p>
              {task.activities && task.activities.activity && (
              <p className="text-sm text-gray-600">
                Activity: {task.activities && task.activities.activity} assigned:{" "}
                {Array.isArray(task.activities) &&
                  task.activities.by.map((user) => (
                    <span key={user._id}>{user.by.usename}</span>
                  ))}
              </p>
            )}

              <h1 className="text-sm text-gray-600">Assets: {task.assets.join(', ')}</h1>
              <div className="mt-4">
                <p className="text-sm text-gray-600">User Name:</p>
                <div className="flex space-x-2">
                  {task.team.map((user) => (
                    <span key={user._id} className="px-2 py-1 text-sm text-gray-800 bg-gray-200 rounded-md">{user.username}</span>
                  ))}
                </div>
              </div>
              {task.team.some(user => user.username === currentUser.username) && <Button gradientDuoTone="purpleToPink" className="mt-4">This task is assigned to you</Button>}
            </div>
          </Card>
        </div>
      ))}
      
      {loadingTask && <p>Loading task...</p>}
      {errorTask && <p>Error fetching task: {errorTask}</p>}
      {task && (
        <div>
          <p>Name: {task.title}</p>
          <p>Description: {task.medium}</p>
        </div>
      )}
    </div>
  );
};

export default TasksComponent;
