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
    <div className=" table-auto overflow-x-scroll md:mx-auto border-emerald-100 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      <Card className=" text-center leading-7 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900  ">
        <h1 className=" text-white">Expenses</h1>
        <h2 className="text-white">
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
