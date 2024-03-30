import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Button, Select } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import PostActivity from '../pages/PostActivity';

const TaskList = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPostActivity, setShowPostActivity] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/task/');
        const data = await response.json();

        if (response.ok) {
          setTasks(data.tasks);
        } else {
          setError(data.message || 'Failed to fetch tasks');
        }
      } catch (error) {
        setError('Something went wrong while fetching the tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const response = await fetch(`/api/task/update/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        // Optionally, update state or perform any necessary actions
        console.log('Task updated successfully');
      } else {
        setError('Failed to update task');
      }
    } catch (error) {
      setError('Something went wrong while updating the task');
    }
  };
  const handleChangeStage = async (taskId, newStage) => {
    try {
      const response = await fetch(`/api/task/tasks/${taskId}/stage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stage: newStage }),
      });
  
      if (response.ok) {
        // Update the stage locally
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task._id === taskId) {
              return { ...task, stage: newStage };
            } else {
              return task;
            }
          })
        );
      } else {
        setError('Failed to update task stage');
      }
    } catch (error) {
      setError('Something went wrong while updating the task stage');
    }
  };
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/task/task/${taskId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      } else {
        setError('Failed to delete task');
      }
    } catch (error) {
      setError('Something went wrong while deleting the task');
    }
  };

  const renderTaskRows = () => {
    return tasks.map((task) => (
      <Table.Row key={task._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
        <Table.Cell>{task.title}</Table.Cell>
        {/* <Table.Cell>{new Date(task.date).toLocaleDateString()}</Table.Cell> */}
        <Table.Cell>{task.priority}</Table.Cell>
        <Table.Cell>
          {task.stage}
        </Table.Cell>
        <Table.Cell>{task.assets}</Table.Cell>
        <Table.Cell>
          <Button color="red" onClick={() => handleDeleteTask(task._id)}>Delete</Button>
        </Table.Cell>
      </Table.Row>
    ));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="table-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 ">
      {currentUser.isManager && (
        <Link to="/dashboard?tab=create-task">
          <Button type="button" gradientDuoTone="purpleToPink">
            Create a Task
          </Button>
        </Link>
      )}
      <Table hoverable shadow="md" className="shadow-md mt-6 w-full">
        <Table.Head>
          <Table.HeadCell>NAME</Table.HeadCell>
          <Table.HeadCell>PRIORITY</Table.HeadCell>
          <Table.HeadCell>STAGE</Table.HeadCell>
          <Table.HeadCell>ASSETS</Table.HeadCell>
          <Table.HeadCell>ACTION</Table.HeadCell> {/* Added action column */}
        </Table.Head>
        <Table.Body>{renderTaskRows()}</Table.Body>
      </Table>
    </div>
  );
};

export default TaskList;
