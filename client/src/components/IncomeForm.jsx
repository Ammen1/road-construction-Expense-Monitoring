import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useGlobalContext } from "../context/Context";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function IncomeForm() {
  const { addIncome, error, setError } = useGlobalContext();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [inputState, setInputState] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/project/getprojects");
        const data = await res.json();

        if (Array.isArray(data.projects)) {
          setUserProjects(data.projects);
        } else {
          setError("Invalid projects data format. Please try again later.");
        }
      } catch (error) {
        setError("Error fetching projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const { title, amount, category, description } = inputState;

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!projectId || !title || !category || !description) {
        throw new Error("Project ID, title, category, and description are required!");
      }
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Amount must be a positive number!");
      }

      const response = await addIncome({ ...inputState, projectId });
      console.log("Response from server:", response);
      setInputState({
        title: "",
        amount: "",
        category: "",
        description: "",
      });
      setProjectId(""); // Reset the project selection after submission
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen self-center">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left Section */}
        <div className="flex-1 lg:mt-10">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Road Con
            </span>
            Monitor
          </Link>
          <p className="text-sm mt-5">
            This is a road construction Expense Monitoring System for a
            contractor project. You can sign up with your email and password or
            with Google.
          </p>
        </div>

        {/* Right Section - Expense Form */}
        <div className="md:flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <Alert color="failure">{error}</Alert>}
            <Label value="Project" />
            <select
              name="project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="input-field"
            >
              <option value="">Select Project</option>
              {userProjects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            <Label value="Title" />
            <TextInput
              type="text"
              value={title}
              name="title"
              placeholder="Enter Title"
              onChange={handleInput("title")}
              className="input-field"
            />
            <Label value="Amount" />
            <TextInput
              value={amount}
              type="number"
              name="amount"
              placeholder="Enter Amount"
              onChange={handleInput("amount")}
              className="input-field"
            />

            <Label value="Category" />
            <TextInput
              name="category"
              value={category}
              type="text"
              placeholder="Enter Category"
              onChange={handleInput("category")}
            />

            <Label value="Description" />
            <TextInput
              name="description"
              value={description}
              placeholder="Add A Description"
              id="description"
              cols="30"
              rows="4"
              onChange={handleInput("description")}
              className="textarea-field"
            />
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
              outline
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Add Budget"
              )}
            </Button>
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
