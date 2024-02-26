import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userProjects, setUserProjects] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState("");
  const [availableManagers, setAvailableManagers] = useState([]);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  // const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  const getEmployees = async () => {
    try {
      const res = await fetch("/api/user/getusers");
      const data = await res.json();
      if (res.ok) {
        const employees = data.users.filter((user) => user.isEmployee);
        setAvailableEmployees(employees);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/project/getprojects?userId=${currentUser._id}`
        );
        const data = await res.json();

        if (Array.isArray(data.projects)) {
          setUserProjects(data.projects);
          if (data.projects.length < 9) {
            setShowMore(false);
          }
        } else {
          console.error("Invalid projects data format:", data.projects);
          setError("Invalid projects data format. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Error fetching projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userProjects.length;
    try {
      const res = await fetch(
        `/api/project/getprojects?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserProjects((prev) => [...prev, ...data.projects]);
        if (data.projects.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/project/deleteproject/${projectIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserProjects((prev) =>
          prev.filter((project) => project._id !== projectIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const calculateTotalBudget = (budget) => {
    const { materials, labor, equipment, permits } = budget;
    const totalBudget = materials + labor + equipment + permits;
    return totalBudget;
  };

  return (
    <div className="table-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && (
        <Link to={"/create-post"}>
          <Button type="button" gradientDuoTone="purpleToPink" className="">
            Create a Project
          </Button>
        </Link>
      )}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {currentUser.isAdmin && userProjects.length > 0 ? (
        <>
          <Table hoverable className="shadow-md mt-6 w-full">
            <Table.Head>
              <Table.HeadCell>date updated</Table.HeadCell>
              <Table.HeadCell>project location</Table.HeadCell>
              <Table.HeadCell>budget</Table.HeadCell>
              <Table.HeadCell>project manager</Table.HeadCell>
              <Table.HeadCell>project employee</Table.HeadCell>
              <Table.HeadCell>project name</Table.HeadCell>
              <Table.HeadCell>start date</Table.HeadCell>
              <Table.HeadCell>end date</Table.HeadCell>
              <Table.HeadCell>status</Table.HeadCell>
              <Table.HeadCell>project tasks</Table.HeadCell>
              <Table.HeadCell>delete</Table.HeadCell>
              <Table.HeadCell>edit</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {userProjects.map((project) => (
                <Table.Row
                  key={project._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${project.name}`}
                    >
                      {project.location}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    Total Budget: {calculateTotalBudget(project.budget)}
                  </Table.Cell>
                  <Table.Cell>
                    {
                      availableManagers.find(
                        (manager) => manager._id === project.manager
                      )?.username
                    }
                  </Table.Cell>
                  <Table.Cell>
                    {
                      availableEmployees.find(
                        (employee) => employee._id === project.employee
                      )?.username
                    }
                  </Table.Cell>

                  <Table.Cell>{project.name}</Table.Cell>
                  <Table.Cell>
                    {new Intl.DateTimeFormat("am-ET", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(project.startDate))}
                  </Table.Cell>

                  <Table.Cell>
                    {new Intl.DateTimeFormat("am-ET", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(project.endDate))}
                  </Table.Cell>

                  <Table.Cell>{project.status}</Table.Cell>
                  <Table.Cell>
                    <div className=" font-bold  ">
                      {" "}
                      <Link to="/">
                        {" "}
                        <ul>
                          {project.tasks.map((task) => (
                            <li key={task._id}>
                              <li>{task.status}</li>
                            </li>
                          ))}
                        </ul>
                      </Link>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setProjectIdToDelete(project._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${project._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
