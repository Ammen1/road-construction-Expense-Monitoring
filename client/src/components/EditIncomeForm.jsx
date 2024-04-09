import React, { useState, useEffect } from "react";
import { Alert, Button, Label, Spinner, TextInput, Select } from "flowbite-react";
import { useGlobalContext } from "../context/Context";
import { Link } from "react-router-dom";

const EditIncomeForm = ({ incomeId }) => {
  const { editIncome, error, setError } = useGlobalContext(); // Assuming projects are available from context
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [userProjects, setUserProjects] = useState([]);
  
  const [inputState, setInputState] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
    projectId: "", // Add projectId to hold the selected project ID
  });
  const [errorMessage, setErrorMessage] = useState("");

  const { title, amount, category, description } = inputState;

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

  useEffect(() => {
    // Update projectId in inputState when incomeId changes
    setInputState((prevState) => ({
      ...prevState,
      projectId: incomeId,
    }));
  }, [incomeId]);
  

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
    setErrorMessage(""); // Clear error when user starts typing
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
  
      const response = await editIncome({
        incomeId, // Include incomeId in the request payload
        title,
        amount,
        category,
        description,
        projectId,
      });
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
    <div>
      <form onSubmit={handleSubmit}>
        {error && <Alert color="failure">{error}</Alert>}
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
        <Label value="Project" />
        <Select
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        className="select-field"
        >
        <option value="">Select Project</option>
        {userProjects && userProjects.map((project) => (
            <option key={project.id} value={project.id}>
            {project.name}
            </option>
        ))}
        </Select>

        <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading} className=" mt-10">
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            "Update Income"
          )}
        </Button>
        {errorMessage && <Alert className="mt-5" color="failure">{errorMessage}</Alert>}
      </form>
    </div>
  );
};

export default EditIncomeForm;
