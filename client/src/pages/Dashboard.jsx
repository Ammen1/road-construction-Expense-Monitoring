import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashboardComp from "../components/DashboardComp";
import Expenses from "../components/Expenses";
import CreateProject from "./CreateProjects";
import Tasks from "../components/Tasks";
import CreateTask from "./CreateTask";
import DashProjectManager from "../components/DashProjectManager";
import Income from "../components/Income";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === "profile" && <DashProfile />}
      {/* posts... */}
      {tab === "projects" && <DashPosts />}
      {/* users */}
      {tab === "users" && <DashUsers />}
      {/* dashboard comp */}
      {tab === "dash" && <DashboardComp />}
      {tab === "create-expense" && <Expenses />}
      {tab === "create-budget" && <Income />}
      {tab === "create-proejct" && <CreateProject />}
      {tab === "create-task" && <CreateTask />}
      {tab === "tasks" && <Tasks />}
      {tab === "project" && <DashProjectManager />}
    </div>
  );
}
