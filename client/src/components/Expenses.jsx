import { useEffect } from "react";
import { useGlobalContext } from "../context/Context";
import ExpenseForm from "./ExpenseForm";

function Expenses() {
  const { getExpenses } = useGlobalContext();

  useEffect(() => {
    getExpenses();
  }, []);
  return (
    <div>
      <div className=" ">
        <div className="">
          <ExpenseForm />
        </div>
      </div>
    </div>
  );
}

export default Expenses;
