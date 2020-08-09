const finances = () => {
  let incomeTracker = [];
  let expenseTracker = [];
  
  const income = (description, amount) => {
    incomeTracker.push({description, amount});
  }

  const deleteIncome = (index) => {
    incomeTracker.splice(index, 1);
  }

  const totalIncome = () => {
    let totalIncome = 0;
    incomeTracker.forEach((income) => {
      totalIncome += income.amount;
    });
    return totalIncome;
  }

  const expenses = (description, amount) => {
    expenseTracker.push({description, amount});
  }

  const deleteExpense = (index) => {
    expenseTracker.splice(index, 1);
  }

  const totalExpenses = () => {
    let totalExpenses = 0;
    expenseTracker.forEach((expense) => {
      totalExpenses += expense.amount;
    });
    return totalExpenses;
  }

  const balance = () => {
    return totalIncome() - totalExpenses();
  }

  return {
    income,
    deleteIncome,
    totalIncome,
    expenses,
    deleteExpense,
    totalExpenses,
    balance
  }
};