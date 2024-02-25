// Node.js code for tracking and calculating expenses

// Sample expenses array
const expenses = [
  { category: "Office Supplies", amount: 200 },
  { category: "Utilities", amount: 500 },
  { category: "Marketing", amount: 1000 },
  { category: "Travel", amount: 300 },
];

// Function to calculate total expenses
const calculateTotalExpenses = (expenseArray) => {
  return expenseArray.reduce((total, expense) => total + expense.amount, 0);
};

// Displaying the list of expenses and total
console.log("List of Expenses:");
expenses.forEach((expense) => {
  console.log(`${expense.category}: $${expense.amount}`);
});

const totalExpenses = calculateTotalExpenses(expenses);
console.log("\nTotal Expenses: $", totalExpenses);
