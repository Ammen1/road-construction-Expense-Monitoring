import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { Button } from 'flowbite-react';

const Notification = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [tasksCount, setTasksCount] = useState(0);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [errorTasks, setErrorTasks] = useState(null);
  const [newTaskNotification, setNewTaskNotification] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoadingTasks(true);
        const response = await axios.get(`/api/task?assignedUser=${currentUser}`);
        const tasks = response.data.tasks;
        const newTasks = tasks.filter(task => task.team.some(user => user.usename === currentUser.username));
        console.log(newTasks);
        setTasksCount(tasks.length);
        if (newTasks.length > 0) {
          setNewTaskNotification(true);
        }
      } catch (error) {
        setErrorTasks(error.message);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 10000);

    return () => clearInterval(interval);
  }, [currentUser]);

  if (!currentUser.isEmployee || loading) {
    return <p></p>;
  }

  return (
    <div className="fixed top-0 -translate-y-96">
      <div>
        <Button gradientDuoTone="purpleToPink" outline className='lg:-translate-y-44'>Total tasks assigned to you: {tasksCount}</Button>
        {newTaskNotification && <p>New task assigned to you!</p>}
      </div>
    </div>
  );
};

export default Notification;
