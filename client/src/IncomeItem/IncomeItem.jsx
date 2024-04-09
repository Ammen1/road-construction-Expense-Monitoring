import { Button, Card } from "flowbite-react";

import { Link, useNavigate } from "react-router-dom";

function IncomeItem({
  id,
  title,
  amount,
  category,
  description,
  deleteItem,
  editItem, // New prop to handle editing
  type,
}) {
  const history = useNavigate(); // Initialize useHistory hook

  const categoryIcon = () => {
    // Category icon logic remains the same
  };

  const expenseCatIcon = () => {
    // Expense category icon logic remains the same
  };


  const handleEdit = () => {
    // Call editItem function with the income ID and redirect to edit form
    editItem(id);
    history(`/editincome/${id}`); // Redirect to edit form route
  };

  return (
    <div className="self-center mt-4">
      <Card className="border self-center rounded-t-md border-emerald-50 dark:bg-gradient-to-tr from-violet-600 to-sky-500 via-teal-600">
        <div>
          <div className="font-bold">
            <h5>Category: {category}</h5>
            <p className="font-bold">Amount: {amount}</p>
          </div>
          <div className="flex justify-between items-center">
            {/* Edit Button */}
           
            <Button
              gradientDuoTone="purpleToPink"
              onClick={() => deleteItem(id)}
              outline
              className="mt-3"
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default IncomeItem;
