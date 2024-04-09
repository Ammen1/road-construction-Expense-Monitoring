import { useState, useEffect } from "react";
import { useGlobalContext } from "../context/Context";
import IncomeForm from "./IncomeForm";
import IncomeItem from "../IncomeItem/IncomeItem";
import EditIncomeForm from "./EditIncomeForm";

function Income() {
  const { incomes, getIncomes, deleteIncome, totalIncome, editIncome } = useGlobalContext();
  const [editFormData, setEditFormData] = useState(null);

  const handleEdit = (income) => {
    setEditFormData(income);
  };
  const handleCancelEdit = () => {
    setEditFormData(null);
  };

  useEffect(() => {
    getIncomes();
  }, [getIncomes]);
  return (
    <div>
      <div>
        <h1>Incomes</h1>
        <h2 className="total-income">
          Total Budget: <span>${totalIncome()}</span>
        </h2>
        <div className="income-content">
          <div className="form-container">
            <IncomeForm />
          </div>
          {editFormData && (
            <div className="form-container">
              <EditIncomeForm
                income={editFormData}
                onCancelEdit={handleCancelEdit}
                editIncome={editIncome}
              />
            </div>
          )}
          <div className="incomes">
            {incomes.map((income) => {
              const { _id, title, amount, date, category, description, type } =
                income;
              return (
                <IncomeItem
                  key={_id}
                  id={_id}
                  title={title}
                  description={description}
                  amount={amount}
                  date={date}
                  type={type}
                  category={category}
                  indicatorColor="var(--color-green)"
                  deleteItem={deleteIncome}
                  editItem={handleEdit}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Income;
