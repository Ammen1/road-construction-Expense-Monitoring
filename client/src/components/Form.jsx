import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../context/Context";
import { Link } from "react-router-dom";
import {
  Alert,
  Select,
  Button,
  Label,
  Spinner,
  TextInput,
} from "flowbite-react";

import { Datepicker } from "flowbite-react";

function Form() {
  const { addIncome, error, setError } = useGlobalContext();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputState, setInputState] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    description: "",
  });

  const { title, amount, date, category, description } = inputState;

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addIncome(inputState);
    try {
      setInputState({
        title: "",
        amount: "",
        date: "",
        category: "",
        description: "",
      });
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Road Con
            </span>
            Monitor
          </Link>
          <p className="text-sm mt-5">
            This is a road construction Expense Monitoring System for a
            contractor project.
          </p>
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="error">{error}</p>}
            <Label value="Title" />
            <TextInput
              type="text"
              value={title}
              name={"title"}
              placeholder="Expense Title"
              onChange={handleInput("title")}
              className="input-field"
            />
            <Label value="amount" />
            <TextInput
              value={amount}
              type="text"
              name={"amount"}
              placeholder={"Expense Amount"}
              onChange={handleInput("amount")}
              className="input-field"
            />
            <Label value="Date" />
            <Datepicker
              language="am-ET"
              labelTodayButton="ዛሬ"
              labelClearButton="አጽዳ"
              name={"date"}
              value={date}
            />

            <Label value="Category" />
            <Select
              required
              value={category}
              name="category"
              id="category"
              onChange={handleInput("category")}
              className="select-field"
            >
              <option value="" disabled>
                Select Option
              </option>
              <option value="education">Education</option>
              <option value="groceries">Groceries</option>
              <option value="health">Health</option>
              <option value="subscriptions">Subscriptions</option>
              <option value="takeaways">Takeaways</option>
              <option value="clothing">Clothing</option>
              <option value="travelling">Travelling</option>
              <option value="other">Other</option>
            </Select>
            <Label value="Description" />
            <TextInput
              name="description"
              value={description}
              placeholder="Add A Reference"
              id="description"
              cols="30"
              rows="4"
              onChange={handleInput("description")}
              className="textarea-field"
            ></TextInput>
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
                "Sign Up"
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

export default Form;
