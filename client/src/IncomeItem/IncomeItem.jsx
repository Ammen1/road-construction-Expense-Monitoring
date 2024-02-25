import { dateFormat } from "../utils/dateFormat";
import {
  bitcoin,
  book,
  card,
  circle,
  clothing,
  comment,
  dollar,
  food,
  freelance,
  medical,
  money,
  piggy,
  stocks,
  takeaway,
  trash,
  tv,
  users,
  yt,
} from "../utils/Icons";
import { Button, Card } from "flowbite-react";

function IncomeItem({
  id,
  title,
  amount,
  category,
  description,
  deleteItem,
  type,
}) {
  const categoryIcon = () => {
    switch (category) {
      case "salary":
        return money;
      case "freelancing":
        return freelance;
      case "investments":
        return stocks;
      case "stocks":
        return users;
      case "bitcoin":
        return bitcoin;
      case "bank":
        return card;
      case "youtube":
        return yt;
      case "other":
        return piggy;
      default:
        return "";
    }
  };

  const expenseCatIcon = () => {
    switch (category) {
      case "education":
        return book;
      case "groceries":
        return food;
      case "health":
        return medical;
      case "subscriptions":
        return tv;
      case "takeaways":
        return takeaway;
      case "clothing":
        return clothing;
      case "travelling":
        return freelance;
      case "other":
        return circle;
      default:
        return "";
    }
  };

  console.log("type", type);

  return (
    <div className="self-center mt-4  ">
      <Card className=" border self-center rounded-t-md border-emerald-50 dark:bg-gradient-to-tr from-violet-600 to-sky-500 via-teal-600 ">
        <div className="">
          <div className=" font-bold">
            <h5>category: {category}</h5>
            <p className=" font-bold">
              amount: {dollar} {amount}
            </p>
          </div>

          <Button
            gradientDuoTone="purpleToPink"
            onClick={() => deleteItem(id)}
            outline
            className=" mt-3 self-center ml-6"
          >
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default IncomeItem;
