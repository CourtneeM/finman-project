let finances = {};

class MonthlyFinances {
  constructor() {
    this.incomeTracker = [];
    this.expenseTracker = [];
  }
  
  income(description, amount) {
    this.incomeTracker.push({description, amount});
  }

  deleteIncome(index) {
    this.incomeTracker.splice(index, 1);
  }

  totalIncome() {
    let totalIncome = 0;
    this.incomeTracker.forEach((income) => {
      totalIncome += income.amount;
    });
    return totalIncome;
  }

  expenses(description, amount) {
    this.expenseTracker.push({description, amount});
  }

  deleteExpense(index) {
    this.expenseTracker.splice(index, 1);
  }

  totalExpenses() {
    let totalExpenses = 0;
    this.expenseTracker.forEach((expense) => {
      totalExpenses += expense.amount;
    });
    return totalExpenses;
  }

  balance() {
    return this.totalIncome() - this.totalExpenses();
  }
};

function newFinancialYear(year) {
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  finances[year] = {};
  months.forEach((month) => {
    finances[year][month] = new MonthlyFinances;
  });
}

newFinancialYear(2020);
newFinancialYear(2021);