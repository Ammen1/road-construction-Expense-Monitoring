import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import PostActivity from '../pages/PostActivity';

const TaskList = (taskId) => {
  const { currentUser } = useSelector((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPostActivity, setShowPostActivity] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/task/');
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

  const handleCreateSubtask = (taskId) => {
    setShowPostActivity(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="table-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isManager && (
        <Link to="/dashboard?tab=create-task">
          <Button type="button" gradientDuoTone="purpleToPink">
            Create a Task
          </Button>
        </Link>
      )}
      <Table hoverable shadow="md" className="shadow-md mt-6 w-full">
        <Table.Head>
          <Table.HeadCell>TITLE</Table.HeadCell>
          <Table.HeadCell>DATE</Table.HeadCell>
          <Table.HeadCell>PRIORITY</Table.HeadCell>
          <Table.HeadCell>STAGE</Table.HeadCell>
          <Table.HeadCell>ASSIGNED TO</Table.HeadCell>
          <Table.HeadCell>ASSETS</Table.HeadCell>
          <Table.HeadCell>ADD SUB TASKS</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {tasks.map((task) => (
            <Table.Row key={task._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell>{task.title}</Table.Cell>
              <Table.Cell>{new Date(task.date).toLocaleDateString()}</Table.Cell>
              <Table.Cell>{task.priority}</Table.Cell>
              <Table.Cell>{task.stage}</Table.Cell>
              <Table.Cell>
                <ul>
                  {task.team.map((member) => (
                    <li key={member._id}>{member.username}</li>
                  ))}
                </ul>
              </Table.Cell>
              <Table.Cell>
                <ul>
                  {task.assets.map((asset, index) => (
                    <li key={index}>{asset}</li>
                  ))}
                </ul>
              </Table.Cell>
              <Table.Cell>
                <Button color="info" onClick={() => handleCreateSubtask(task._id)}>
                  Add Subtask
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {showPostActivity && <PostActivity id={taskId} onSubTaskCreated={() => setShowPostActivity(false)} />}
    </div>
  );
};

export default TaskList;
