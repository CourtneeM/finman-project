let finances = {};

class MonthlyFinances {
  constructor() {
    this.incomeTracker = [];
    this.expenseTracker = [];
  }
  
  income(amount, description) {
    this.incomeTracker.push({amount, description});
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

  expense(amount, description) {
    this.expenseTracker.push({amount, description});
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

const userInputHandler = (() => {
  const addYearBtn = document.getElementById('add-year-btn');
  addYearBtn.addEventListener('click', () => {
    const yearSelector = Array.from(document.querySelectorAll('.financial-year'));
    const latestYear = Number(yearSelector[yearSelector.length - 1].value);
    yearSelector.forEach((selector) => {
      const option = document.createElement('option');
      option.text = latestYear + 1;
      selector.add(option);
    });
    newFinancialYear((latestYear + 1));
  });
  
  const addBtn = document.getElementById('add-transaction-btn');
  addBtn.addEventListener('click', () => {
    const year = document.getElementById('new-transaction-year');
    const month = document.getElementById('new-transaction-month');
    const transactionType = document.getElementById('transaction-type').value;
    const amount = document.getElementById('amount');
    const description = document.getElementById('description');

    finances[year.value][month.value][transactionType](Number(amount.value), description.value);
    amount.value = "";
    description.value = "";
  });
})();

const displayHandler = (() => {
  let incomeAmount = document.querySelector('.income-amount');
  let expensesAmount = document.querySelector('.expenses-amount');
  let balanceAmount = document.querySelector('.balance-amount');
  const transactions = () => {
    const submitYearMonthBtn = document.getElementById('submit-year-month-btn');
    submitYearMonthBtn.addEventListener('click', () => {
      const year = document.getElementById('show-transaction-year').value;
      const month = document.getElementById('show-transaction-month').value;

      incomeAmount.textContent = `$${finances[year][month].totalIncome()}`;
      expensesAmount.textContent = `$${finances[year][month].totalExpenses()}`;
      balanceAmount.textContent = `$${finances[year][month].balance()}`;
    });
  }

  return {
    transactions,

  }
})();
displayHandler.transactions();

function newFinancialYear(year) {
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  finances[year] = {};
  months.forEach((month) => {
    finances[year][month] = new MonthlyFinances;
  });
}

newFinancialYear(2020);

