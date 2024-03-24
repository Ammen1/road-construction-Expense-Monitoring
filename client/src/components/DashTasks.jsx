import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TaskComponent({ taskId }) {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchTask = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/task/${taskId}`); // Assuming you have an endpoint for fetching a single task
          setTask(response.data.task);
        } catch (error) {
          console.error('Error fetching task:', error);
          console.log(error.response);
          setError('Error fetching task. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchTask();
    }, [taskId]); // Ensure useEffect depends on taskId
  
    if (loading) {
      return <p>Loading task...</p>;
    }
  
    if (error) {
      return <p>Error: {error}</p>;
    }
  
    if (!task) {
      return <p>No task found.</p>;
    }
  
    return (
      <div>
        <h2>{task.title}</h2>
        <p>Description: {task.description}</p>
        {/* Render other task details here */}
      </div>
    );
  }
  