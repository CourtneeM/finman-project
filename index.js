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
  const addBtn = document.getElementById('add-transaction-btn');
  const submitShowTransactionsBtn = document.getElementById('submit-year-month-btn');
  const monthlyBreakdownSection = document.querySelector('.monthly-breakdown');

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
  
  addBtn.addEventListener('click', () => {
    const year = document.getElementById('new-transaction-year');
    const month = document.getElementById('new-transaction-month');
    const transactionType = document.getElementById('transaction-type').value;
    const amount = document.getElementById('amount');
    const description = document.getElementById('description');

    if (amount.value === "" || description.value === "") return;

    finances[year.value][month.value][transactionType](Number(amount.value), description.value);
    amount.value = "";
    description.value = "";
  });

  submitShowTransactionsBtn.addEventListener('click', () => {
    displayHandler.monthYear();
    displayHandler.transactions();
  });

  const reviewYearBtn = document.getElementById('review-year');
  reviewYearBtn.addEventListener('click', () => {
    displayHandler.reviewYear();
  });

  monthlyBreakdownSection.addEventListener('click', (e) => {
    let selectedYear = document.querySelector('.display-year').textContent;
    let selectedMonth = document.querySelector('.display-month').textContent;
    let transactionType = Array.from(e.target.parentNode.parentNode.parentNode.parentNode.children)[0].textContent;
    let deleteTransaction = `delete${transactionType}`;
    if (e.target.classList.contains('delete-btn')) {
      let index = Array.from(e.target.parentNode.parentNode.children).indexOf(e.target.parentNode);
      finances[selectedYear][selectedMonth][deleteTransaction](index);
      displayHandler.transactions();
    }
  });
})();

const displayHandler = (() => {

  const monthYear = () => {
    const year = document.getElementById('show-transaction-year').value;
    const month = document.getElementById('show-transaction-month').value;
    let yearDisplay = document.querySelector('.display-year');
    let monthDisplay = document.querySelector('.display-month');
    monthDisplay.parentElement.style.visibility = "visible";
    monthDisplay.style.visibility = "visible";
    monthDisplay.textContent = month;
    yearDisplay.textContent = year;
  }

  const transactions = () => {
    const year = document.getElementById('show-transaction-year').value;
    const month = document.getElementById('show-transaction-month').value;
    let incomeAmount = document.querySelector('.income-amount');
    let expensesAmount = document.querySelector('.expenses-amount');
    let balanceAmount = document.querySelector('.balance-amount');
    
    incomeAmount.textContent = `$${finances[year][month].totalIncome()}`;
    expensesAmount.textContent = `$${finances[year][month].totalExpenses()}`;
    balanceAmount.textContent = `$${finances[year][month].balance()}`;

    const incomeBreakdown = document.querySelector('.income-breakdown');
    const monthlyIncome = finances[year][month].incomeTracker;

    if (incomeBreakdown.firstChild) {
      while (incomeBreakdown.firstChild) {
        incomeBreakdown.removeChild(incomeBreakdown.firstChild);
      }
    }

    monthlyIncome.forEach((transaction) => {
      let div = document.createElement('div');
      for (let key in transaction) {
        let p = document.createElement('p');
        if (typeof transaction[key] === "number") {
          p.textContent = `$${transaction[key]}`;
        } else {
          p.textContent = transaction[key];
        }
        div.appendChild(p);
      }
      let trash = document.createElement('i');
      trash.classList.add('far', 'fa-trash-alt', 'delete-btn');
      div.appendChild(trash);
      incomeBreakdown.appendChild(div);
    });


    const expenseBreakdown = document.querySelector('.expense-breakdown');
    const monthlyExpenses = finances[year][month].expenseTracker;

    if (expenseBreakdown.firstChild) {
      while (expenseBreakdown.firstChild) {
        expenseBreakdown.removeChild(expenseBreakdown.firstChild);
      }
    }

    monthlyExpenses.forEach((transaction) => {
      let div = document.createElement('div');
      for (let key in transaction) {
        let p = document.createElement('p');
        if (typeof transaction[key] === "number") {
          p.textContent = `$${transaction[key]}`;
        } else {
          p.textContent = transaction[key];
        }
        div.appendChild(p);
      }
      let trash = document.createElement('i');
      trash.classList.add('far', 'fa-trash-alt', 'delete-btn');
      div.appendChild(trash);
      expenseBreakdown.appendChild(div);
    });
  }

  const reviewYear = () => {
    const year = document.getElementById('show-transaction-year').value;
    let yearDisplay = document.querySelector('.display-year');
    let monthDisplay = document.querySelector('.display-month');
    let incomeAmount = document.querySelector('.income-amount');
    let expensesAmount = document.querySelector('.expenses-amount');
    let balanceAmount = document.querySelector('.balance-amount');

    monthDisplay.style.visibility = "hidden";
    yearDisplay.style.visibility = "visible";
    yearDisplay.textContent = year;
    console.log(yearDisplay);
    
    const incomeTracker = [];
    const expenseTracker = [];
    for (let month in finances[year]) {
      incomeTracker.push(finances[year][month].totalIncome());
      expenseTracker.push(finances[year][month].totalExpenses());
    };

    let yearlyIncome = 0;
    let yearlyExpenses = 0;
    
    incomeTracker.forEach((monthlyIncome) => {
      yearlyIncome += monthlyIncome;
    });

    expenseTracker.forEach((monthlyExpense) => {
      yearlyExpenses += monthlyExpense;
    })

    incomeAmount.textContent = `$${yearlyIncome}`;
    expensesAmount.textContent = `$${yearlyExpenses}`;
    balanceAmount.textContent = `$${yearlyIncome - yearlyExpenses}`;

    
    const incomeBreakdown = document.querySelector('.income-breakdown');
    if (incomeBreakdown.firstChild) {
      while (incomeBreakdown.firstChild) {
        incomeBreakdown.removeChild(incomeBreakdown.firstChild);
      }
    }

    const expenseBreakdown = document.querySelector('.expense-breakdown');
    if (expenseBreakdown.firstChild) {
      while (expenseBreakdown.firstChild) {
        expenseBreakdown.removeChild(expenseBreakdown.firstChild);
      }
    }

    for (let month in finances[year]) {
      // income breakdown section
      let incomeDiv = document.createElement('div');
      let incomeP = document.createElement('p');
      incomeP.textContent = `$${finances[year][month].totalIncome()}`;
      incomeDiv.appendChild(incomeP);
      
      let incomeMonthP = document.createElement('p');
      incomeMonthP.textContent = month;
      incomeMonthP.style.textTransform = "capitalize";
      incomeDiv.appendChild(incomeMonthP);
      
      let incomeTrash = document.createElement('i');
      incomeTrash.classList.add('far', 'fa-trash-alt', 'delete-btn');
      incomeDiv.appendChild(incomeTrash);
      incomeBreakdown.appendChild(incomeDiv);

      // expense breakdown section
      let expensesDiv = document.createElement('div');
      let expensesP = document.createElement('p');
      expensesP.textContent = `$${finances[year][month].totalExpenses()}`;
      expensesDiv.appendChild(expensesP);
      
      let expensesMonthP = document.createElement('p');
      expensesMonthP.textContent = month;
      expensesMonthP.style.textTransform = "capitalize";
      expensesDiv.appendChild(expensesMonthP);
      
      let expensesTrash = document.createElement('i');
      expensesTrash.classList.add('far', 'fa-trash-alt', 'delete-btn');
      expensesDiv.appendChild(expensesTrash);
      expenseBreakdown.appendChild(expensesDiv);
    } 
  }

  return {
    monthYear,
    transactions,
    reviewYear
  }
})();

function newFinancialYear(year) {
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  finances[year] = {};
  months.forEach((month) => {
    finances[year][month] = new MonthlyFinances;
  });
}

newFinancialYear(2020);

// make review year button work
// add filters 
// add local storage