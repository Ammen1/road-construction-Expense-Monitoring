import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'flowbite-react';

export default function DashboardManager() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStatistics = async () => {
      try {
        const response = await axios.get('/api/task/dashboard');
        setStatistics(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        setLoading(false);
      }
    };

    fetchDashboardStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-red-600">Error fetching dashboard statistics</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className=" w-full">
        <Card className="p-6 md:p-8 w-full">
          <h2 className="mb-4 text-2xl font-semibold text-gray-100">Dashboard Statistics</h2>
          <div className="grid gap-4 w-full md:grid-cols-3">
            <div className="flex flex-col justify-center p-8 bg-gray-900 rounded-md">
              <h3 className="text-sm font-semibold text-gray-100">Total Tasks:</h3>
              <span className="text-lg font-semibold text-gray-100">{statistics.totalTasks}</span>
            </div>
            <div className="flex flex-col justify-center p-8 bg-gray-900 rounded-md">
              <h3 className="text-sm font-semibold text-gray-100">Task Stages:</h3>
              <ul className="pl-6 list-disc">
                {Object.entries(statistics.tasks).map(([stage, count]) => (
                  <li key={stage}>{stage}: {count}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center p-8 bg-gray-900 rounded-md">
              <h3 className="text-sm font-semibold text-gray-100">Task Priority Distribution:</h3>
              <ul className="pl-6 list-disc">
                {statistics.graphData.map(({ name, total }) => (
                  <li key={name}>{name}: {total}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
        <Card className="p-6 md:p-8 w-56 mt-8 ">
          <h3 className="mb-4 text-2xl font-semibold text-gray-1s00">Last 10 Tasks:</h3>
          <ol className="grid pl-6 list-decimal">
          {statistics.last10Task.map(task => (
            <li key={task._id}>{task.title}</li>
          ))}
        </ol>

        </Card>
      </div>
    </div>
  );
};
