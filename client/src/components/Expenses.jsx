import { useEffect } from "react";
import { useGlobalContext } from "../context/Context";
import ExpenseForm from "./ExpenseForm";
import { Card } from "flowbite-react";

function Expenses() {
  const { getExpenses, totalExpenses } = useGlobalContext();

  useEffect(() => {
    getExpenses();
  }, []);
  return (
    <div className="  ">
      <Card className=" text-center leading-7 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 ">
        <h1>Expenses</h1>
        <h2 className="">
          Total Expense: <span>${totalExpenses()}</span>
        </h2>
      </Card>

      <div className="">
        <ExpenseForm />
      </div>
    </div>
  );
}

export default Expenses;
