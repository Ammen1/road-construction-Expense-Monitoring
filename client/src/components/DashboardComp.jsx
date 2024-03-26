import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

import { useGlobalContext } from "../context/Context";

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthProjects, setLastMonthProjects] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const { getExpenses, totalBalance, totalIncome, totalExpenses } = useGlobalContext();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/project/getproject?limit=5");
        const data = await res.json();
        if (res.ok) {
          setProjects(data.projects);
          setTotalProjects(data.totalProjects);
          setLastMonthProjects(data.lastMonthProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchProjects();
      getExpenses();
    }
  }, [currentUser, getExpenses]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap justify-center gap-4">
        {/* Total Users */}
        <div className="flex flex-col w-full gap-4 p-3 rounded-md shadow-md dark:bg-slate-800 md:w-72">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 uppercase text-md">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="p-3 text-5xl text-white bg-teal-600 rounded-full shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="flex items-center text-green-500">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        {/* Expenses */}
        <div className="flex flex-col w-full gap-4 p-3 rounded-md shadow-md dark:bg-slate-800 md:w-72">
        <div className="flex justify-between">
          <div>
            <h3 className="text-gray-500 uppercase text-md">Total Balance</h3>
            <h2 className={`total-Expenses justify-center items-center ${totalBalance() < 0 ? 'text-red-500' : ''}`}>
              <span>{totalBalance()}</span>
            </h2>
          </div>
          <HiDocumentText className="p-3 text-5xl text-white rounded-full shadow-lg bg-lime-600" />
        </div>

        </div>              
        <div className="flex flex-col w-full gap-4 p-3 rounded-md shadow-md dark:bg-slate-800 md:w-72">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 uppercase text-md">Total Expense</h3>
              <h2 className="items-center justify-center total-Expenses">
                <span>{totalExpenses()}</span>
              </h2>
            </div>
            <HiDocumentText className="p-3 text-5xl text-white rounded-full shadow-lg bg-lime-600" />
          </div>
        </div>
          <div className="flex flex-col w-full gap-4 p-3 rounded-md shadow-md dark:bg-slate-800 md:w-72">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 uppercase text-md">Total Budget</h3>
              <h2 className="items-center justify-center total-Expenses">
                <span>{totalIncome()}</span>
              </h2>
            </div>
            <HiDocumentText className="p-3 text-5xl text-white rounded-full shadow-lg bg-lime-600" />
          </div>
        </div>
        <div className="flex flex-col w-full gap-4 p-3 rounded-md shadow-md dark:bg-slate-800 md:w-72">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 uppercase text-md">
                Total Projects
              </h3>
              <p className="text-2xl">{totalProjects}</p>
            </div>
            <HiDocumentText className="p-3 text-5xl text-white rounded-full shadow-lg bg-lime-600" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="flex items-center text-green-500">
              <HiArrowNarrowUp />
              {lastMonthProjects}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="flex flex-wrap justify-center gap-4 py-3 mx-auto">
        <div className="flex flex-col w-full p-2 rounded-md shadow-md md:w-auto dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="p-2 text-center">Recent users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {users.map((user) => (
                <Table.Row
                  key={user._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt="user"
                      className="w-10 h-10 bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Recent Tasks */}
        <div className="flex flex-col w-full p-2 rounded-md shadow-md md:w-auto dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="p-2 text-center">Recent Tasks</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=tasks"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Task name</Table.HeadCell>
              <Table.HeadCell>Task Status</Table.HeadCell>
              <Table.HeadCell>Task dueDate</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {projects.map((project) => (
                <Table.Row
                  key={project._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {/* Define your task name here */}
                    {project.tasks.map((task) => (
                      <li key={task._id}>{task.name}</li>
                    ))}
                  </Table.Cell>
                  <Table.Cell>
                    {/* Define your task status here */}
                    {project.tasks.map((task) => (
                      <li key={task._id}>{task.status}</li>
                    ))}
                  </Table.Cell>
                  <Table.Cell>
                    {/* Define your task status here */}
                    {project.tasks.map((task) => (
                      <li key={task._id}>
                        {new Date(task.dueDate).toLocaleDateString("am-ET")}
                      </li>
                    ))}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Recent projects */}
        <div className="flex flex-col w-full p-2 rounded-md shadow-md md:w-auto dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="p-2 text-center">Recent projects</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=projects"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Project name</Table.HeadCell>
              <Table.HeadCell>Budget</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {projects.map((project) => (
                <Table.Row
                  key={project._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{project.name}</Table.Cell>
                  <div className="mt-4">
                    <h4 className="mb-2 text-lg font-semibold">Budget:</h4>
                    {project.budget}
                  </div>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}
