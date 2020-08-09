const finances = () => {
  let incomeTracker = [];
  let expenseTracker = [];
  let totalIncome = 0;
  let totalExpenses = 0;
  
  const income = (description, amount) => {
    incomeTracker.push({description, amount});
    totalIncome += amount;
  }

  const deleteIncome = (index) => {
    totalIncome -= incomeTracker[index].amount;
    incomeTracker.splice(index, 1);
    totalIncome;
  }

  const expenses = (description, amount) => {
    expenseTracker.push({description, amount});
    totalExpenses += amount;
  }

  const deleteExpense = (index) => {
    totalExpenses -= expenseTracker[index].amount;
    expenseTracker.splice(index, 1);
  }

  const balance = () => {
    return `Income: $${totalIncome} | Expenses: $${totalExpenses} | Balance: $${totalIncome - totalExpenses}`;
  }

  return {
    income,
    deleteIncome,
    expenses,
    deleteExpense,
    balance
  }
};