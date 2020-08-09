const finances = () => {
  let totalIncome = 0;
  let totalExpenses = 0;
  
  const income = (amount) => totalIncome += amount;

  const deleteIncome = (amount) => totalIncome -= amount;

  const expenses = (amount) => totalExpenses += amount;

  const deleteExpense = (amount) => totalExpenses -= amount;

  const balance = () => totalIncome - totalExpenses;

  return {
    income,
    deleteIncome,
    expenses,
    deleteExpense,
    balance
  }
};
