import { useState, useEffect } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import IncomeItem from "../IncomeItem/IncomeItem";
import { useGlobalContext } from "../context/Context";
import { Link } from "react-router-dom";

export default function ExpenseForm() {
  const { addExpense, expenses, getExpenses, deleteExpense, error, setError } =
    useGlobalContext();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputState, setInputState] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    getExpenses();
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
      const response = await addExpense(inputState);
      console.log("Response from server:", response);
      setInputState({
        title: "",
        amount: "",
        category: "",
        description: "",
      });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen self-center ">
      <div className=" justify-center items-center ">
        <div className="space-y-4 flex gap-9 ">
          {expenses.map((income) => {
            const { _id, title, amount, category, type } = income;
            console.log(income);
            return (
              <IncomeItem
                key={_id}
                id={_id}
                title={title}
                amount={amount}
                type={type}
                category={category}
                deleteItem={deleteExpense}
              />
            );
          })}
        </div>
      </div>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
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
            <Label value="Expense Title" />
            <TextInput
              type="text"
              value={title}
              name="title"
              placeholder="Enter Expense Title"
              onChange={handleInput("title")}
              className="input-field"
            />
            <Label value="Expense Amount" />
            <TextInput
              value={amount}
              type="number"
              name="amount"
              placeholder="Enter Expense Amount"
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
                "Add Expense"
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
