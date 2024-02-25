import React, { useContext, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/expense";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  const addExpense = async (income) => {
    try {
      const response = await axios.post(`${BASE_URL}/add-expense`, income);

      if (response.status !== 200) {
        throw new Error("Expense not added successfully");
      }

      getExpenses();
    } catch (error) {
      setError(error.message);
    }
  };

  const getExpenses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-expenses`);
      setExpenses(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/delete-expense/${id}`);

      if (!res.data) {
        throw new Error("Expense not deleted successfully");
      }

      getExpenses();
    } catch (error) {
      setError(error.message);
    }
  };

  const totalExpenses = () => {
    let totalIncome = 0;
    expenses.forEach((income) => {
      totalIncome = totalIncome + income.amount;
    });

    return totalIncome;
  };

  const totalBalance = () => {
    return totalExpenses();
  };

  const transactionHistory = () => {
    const history = [...expenses];
    history.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return history.slice(0, 3);
  };

  return (
    <GlobalContext.Provider
      value={{
        expenses,

        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
