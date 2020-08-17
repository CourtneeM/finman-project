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
    localStorageHandler.saveTransactions(year.value, month.value, transactionType, amount.value, description.value);
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
    let transactionType = Array.from(e.target.parentNode.parentNode.parentNode.children)[0].textContent;
    let deleteTransaction = `delete${transactionType}`;
    if (e.target.classList.contains('delete-btn')) {
      let index = Array.from(e.target.parentNode.parentNode.children).indexOf(e.target.parentNode) - 1;
      finances[selectedYear][selectedMonth][deleteTransaction](index);
      localStorageHandler.deleteLocalTransaction(selectedYear, selectedMonth, deleteTransaction, index);
      displayHandler.transactions();
    }
  });

  const displayAddTransactionBtn = document.getElementById('display-add-transaction-btn');
  const addTranscationSection = document.querySelector('.user-inputs');
  displayAddTransactionBtn.addEventListener('click', () => {
    addTranscationSection.classList.remove('displayNone');
    addTranscationSection.classList.add('displayFlex');
  });
  
  addTranscationSection.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-window-close')) {
      addTranscationSection.classList.remove('displayFlex');
      addTranscationSection.classList.add('displayNone');
    }  
  });
})();

const displayHandler = (() => {
  const resetTransactionDisplay = () => {
    const transactionBreakdowns = Array.from(document.querySelectorAll('.transaction-breakdown'));
    transactionBreakdowns.forEach((breakdown) => {
      if (breakdown.firstChild) {
        while (breakdown.firstChild) {
          breakdown.removeChild(breakdown.firstChild);
        }
      }
    });
  };

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

    function displayTransactionHeading() {
      let div = document.createElement('div');
      let amountP = document.createElement('p');
      let descriptionP = document.createElement('p');
      let deleteP = document.createElement('p');
      amountP.textContent = "Amount";
      descriptionP.textContent = "Description";
      deleteP.textContent = "Delete";
      div.appendChild(amountP);
      div.appendChild(descriptionP);
      div.appendChild(deleteP);
      return div;
    }

    function displayTransactions(transaction) {
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
      return div;
    }

    resetTransactionDisplay();

    const incomeBreakdown = document.querySelector('.income-breakdown');
    incomeBreakdown.appendChild(displayTransactionHeading());
    const monthlyIncome = finances[year][month].incomeTracker;
    monthlyIncome.forEach((transaction) => {
      incomeBreakdown.appendChild(displayTransactions(transaction));
    });
    
    const expenseBreakdown = document.querySelector('.expense-breakdown');
    expenseBreakdown.appendChild(displayTransactionHeading());
    const monthlyExpenses = finances[year][month].expenseTracker;
    monthlyExpenses.forEach((transaction) => {
      expenseBreakdown.appendChild(displayTransactions(transaction));
    });
  }

  const reviewYear = () => {
    const year = document.getElementById('show-transaction-year').value;
    const yearDisplay = document.querySelector('.display-year');
    const monthDisplay = document.querySelector('.display-month');
    
    monthDisplay.style.visibility = "hidden";
    yearDisplay.style.visibility = "visible";
    yearDisplay.textContent = year;
    
    let yearlyIncome = 0;
    let yearlyExpenses = 0;

    for (let month in finances[year]) {
      yearlyIncome += finances[year][month].totalIncome();
      yearlyExpenses += finances[year][month].totalExpenses();
    };

    let incomeAmount = document.querySelector('.income-amount');
    let expensesAmount = document.querySelector('.expenses-amount');
    let balanceAmount = document.querySelector('.balance-amount');

    incomeAmount.textContent = `$${yearlyIncome}`;
    expensesAmount.textContent = `$${yearlyExpenses}`;
    balanceAmount.textContent = `$${yearlyIncome - yearlyExpenses}`;

    function displayTransactionHeading() {
      let div = document.createElement('div');
      let amountP = document.createElement('p');
      let descriptionP = document.createElement('p');
      amountP.textContent = "Amount";
      descriptionP.textContent = "Description";
      div.appendChild(amountP);
      div.appendChild(descriptionP);
      return div;
    }

    function displayTransactions(totalType) {
      for (let month in finances[year]) {
        let div = document.createElement('div');
        let p = document.createElement('p');
        p.textContent = `$${finances[year][month][totalType]()}`;
        div.appendChild(p);
        
        let monthP = document.createElement('p');
        monthP.textContent = month;
        monthP.style.textTransform = "capitalize";
        div.appendChild(monthP);
        if (totalType === "totalIncome") {
          incomeBreakdown.appendChild(div);
        } else {
          expenseBreakdown.appendChild(div);
        }
      }
    }

    resetTransactionDisplay();

    const incomeBreakdown = document.querySelector('.income-breakdown');
    const expenseBreakdown = document.querySelector('.expense-breakdown');
    incomeBreakdown.appendChild(displayTransactionHeading());
    expenseBreakdown.appendChild(displayTransactionHeading());
    displayTransactions("totalIncome");
    displayTransactions("totalExpenses");
  }

  return {
    monthYear,
    transactions,
    reviewYear
  }
})();

const localStorageHandler = (() => {
  const saveTransactions = (year, month, transactionType, amount, description) => {
    let localFinances = {};
    if (localStorage.getItem('localFinances') === null) {
      localFinances = {};
      newFinancialYear(2020);
    } else {
      localFinances = JSON.parse(localStorage.getItem('localFinances'));
      for (let month in localFinances[year]) {
        let incomeTracker = localFinances[year][month].incomeTracker;
        let expenseTracker = localFinances[year][month].expenseTracker;
        localFinances[year][month] = new MonthlyFinances;
        localFinances[year][month].incomeTracker = incomeTracker;
        localFinances[year][month].expenseTracker = expenseTracker;     
      }
    }
    if (localFinances[year] === undefined) {
      const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
      localFinances[year] = {};
      months.forEach((month) => {
        localFinances[year][month] = new MonthlyFinances;
      });
    }
    localFinances[year][month][transactionType](Number(amount), description);
    localStorage.setItem('localFinances', JSON.stringify(localFinances));

  }

  const displayTransactions = () => {
    const year = document.getElementById('show-transaction-year').value;
    const yearDisplay = document.querySelector('.display-year');
    const monthDisplay = document.querySelector('.display-month');
    let localFinances = {};
    if (localStorage.getItem('localFinances') === null) {
      localFinances = {};
    } else {
      localFinances = JSON.parse(localStorage.getItem('localFinances'));
      newFinancialYear(2020);
      for (let month in localFinances[year]) {
        let incomeTracker = localFinances[year][month].incomeTracker;
        let expenseTracker = localFinances[year][month].expenseTracker;

        localFinances[year][month] = new MonthlyFinances;
        localFinances[year][month].incomeTracker = incomeTracker;
        localFinances[year][month].expenseTracker = expenseTracker;

        finances[year][month].incomeTracker = incomeTracker;
        finances[year][month].expenseTracker = expenseTracker;
      }
    }

    monthDisplay.style.visibility = "hidden";
    yearDisplay.style.visibility = "visible";
    yearDisplay.textContent = year;
    
    let yearlyIncome = 0;
    let yearlyExpenses = 0;

    for (let month in localFinances[year]) {
      yearlyIncome += localFinances[year][month].totalIncome();
      yearlyExpenses += localFinances[year][month].totalExpenses();
    };

    let incomeAmount = document.querySelector('.income-amount');
    let expensesAmount = document.querySelector('.expenses-amount');
    let balanceAmount = document.querySelector('.balance-amount');

    incomeAmount.textContent = `$${yearlyIncome}`;
    expensesAmount.textContent = `$${yearlyExpenses}`;
    balanceAmount.textContent = `$${yearlyIncome - yearlyExpenses}`;
    
    const incomeBreakdown = document.querySelector('.income-breakdown');
    const expenseBreakdown = document.querySelector('.expense-breakdown');
    incomeBreakdown.appendChild(displayTransactionHeading());
    expenseBreakdown.appendChild(displayTransactionHeading());
    displayTransactions("totalIncome");
    displayTransactions("totalExpenses");

    function displayTransactionHeading() {
      let div = document.createElement('div');
      let amountP = document.createElement('p');
      let descriptionP = document.createElement('p');
      amountP.textContent = "Amount";
      descriptionP.textContent = "Description";
      div.appendChild(amountP);
      div.appendChild(descriptionP);
      return div;
    }

    function displayTransactions(totalType) {
      for (let month in localFinances[year]) {
        let div = document.createElement('div');
        let p = document.createElement('p');
        p.textContent = `$${localFinances[year][month][totalType]()}`;
        div.appendChild(p);
        
        let monthP = document.createElement('p');
        monthP.textContent = month;
        monthP.style.textTransform = "capitalize";
        div.appendChild(monthP);
        if (totalType === "totalIncome") {
          incomeBreakdown.appendChild(div);
        } else {
          expenseBreakdown.appendChild(div);
        }
      }
    }
  }

  const deleteLocalTransaction = (selectedYear, selectedMonth, deleteTransaction, index) => {
    let localFinances = {};
    if (localStorage.getItem('localFinances') === null) {
      localFinances = {};
    } else {
      localFinances = JSON.parse(localStorage.getItem('localFinances'));
      for (let month in localFinances[selectedYear]) {
        let incomeTracker = localFinances[selectedYear][month].incomeTracker;
        let expenseTracker = localFinances[selectedYear][month].expenseTracker;
        localFinances[selectedYear][month] = new MonthlyFinances;
        localFinances[selectedYear][month].incomeTracker = incomeTracker;
        localFinances[selectedYear][month].expenseTracker = expenseTracker;     
      }
    }

    localFinances[selectedYear][selectedMonth][deleteTransaction](index);
    localStorage.setItem('localFinances', JSON.stringify(localFinances));
  }

  return {
    saveTransactions,
    displayTransactions,
    deleteLocalTransaction
  }
})();

function newFinancialYear(year) {
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  finances[year] = {};
  months.forEach((month) => {
    finances[year][month] = new MonthlyFinances;
  });
}

document.addEventListener('DOMContentLoaded', localStorageHandler.displayTransactions());
window.addEventListener('resize', () => {
  const userInputSection = document.querySelector('.user-inputs');
  if (window.innerWidth > 700) {
    userInputSection.classList.remove('displayNone');
    userInputSection.classList.add('displayFlex')
  }
  if (window.innerWidth <= 700) {
    userInputSection.classList.remove('displayFlex');
    userInputSection.classList.add('displayNone');
  }
});

// Fix error when submitting empty year month