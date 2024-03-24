import { Modal, Button, Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ApproveSupplier() {
  const { currentUser } = useSelector((state) => state.user);
  const [userProjects, setUserProjects] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState(null);
  const navigate = useNavigate();

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

  const handleApplyNow = async (projectId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/project/projects/${projectId}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, userId: currentUser._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setApplicationMessage(data.message);
      } else {
        setError(data.message);
      }
      navigate(`/apply/${projectId}`);
    } catch (error) {
      console.error("Error submitting application:", error);
      setError("Error submitting application. Please try again later.");
    }
  };


  return (
    <Card className="h-full">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {applicationMessage && (
        <p className="text-green-500">{applicationMessage}</p>
      )}
      {userProjects.map((project) => (
        <div key={project._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{project.name}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {project.description}
          </p>
          <Link to={`/apply/${project._id}`} className="text-white bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-md">
            Apply Now
            </Link>
        </div>
      ))}
      
      {showMore && (
        <Link
          to="#"
          onClick={handleShowMore}
          className="text-purple-500 underline"
        >
          Show more
        </Link>
      )}
    </Card>
  );
}
