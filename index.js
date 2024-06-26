
let budgetButton = document.querySelector('.Enter-budget button'),
    budgetInput = document.querySelector('.Enter-budget input'),
    expenseFirstInput = document.querySelector('.Enter-expense input'),
    expenseSecondInput = document.getElementById('Enter-expense-second-input'),
    expenseButton = document.querySelector('.Enter-expense button'),
    reset = document.querySelector('.Enter-title-button'),
    BudgetPrice = document.querySelector('.Return-price-nouns-forBudget'),
    ExpensePrice = document.querySelector('.Return-price-nouns-forExpense'),
    BalancePrice = document.querySelector('.Return-price-nouns-forBalance'),
    ReturnDetailNoun = document.querySelector('.Return-detail-nouns-own'),
    ReturnDetailPrice = document.querySelector('.Return-detail-nouns-price'),
    modifie = document.querySelector('.fa-pen-to-square'),
    Historique = document.querySelector('.Historique')
    supprime = document.querySelector('.fa-trash'),
    histore = document.querySelector('.Historyii');
let body = document.body;
let myChart;
let separatorDiv = document.createElement('div');
let message = document.querySelector('.message');
let parent = document.querySelector('.parent');
let compte = document.querySelector('.Return-detail-nouns');
let bar = document.querySelector('.bg-primary');
let miseAjour1 = document.querySelector('.miseAjour1');
let miseAjour2 = document.querySelector('.miseAjour2');
let ferme = document.querySelector('.close')
let root = document.querySelector('.root')

let itemID = 0;

let itemList;
const objectData = {
    Budget: 0,
    Expense: 0,
    Balance: 0,
  expenses: []
};

if (localStorage.getItem("itemList")) {
    itemList = JSON.parse(localStorage.getItem("itemList"));
    setValues();
    updateChartLabels();
  } else {
    localStorage.setItem("itemList", JSON.stringify(objectData));
    itemList = objectData;
  }

  
  budgetButton.addEventListener("click", addBudget);
  expenseButton.addEventListener("click",function () {
    addExpense() ;
    recentActivity()
  } );
  reset.addEventListener('click', Reset)


  function addBudget() {
    if (parseFloat(budgetInput.value) < 0 || budgetInput.value === '') {
        setTimeout(function () { message.style.display = 'block'; miseAjour1.textContent = 'Ajout du budget'; miseAjour2.innerHTML = 'Votre budjet doit être un nombre positif <br> et ne dois pas être un champ vide';  }, 1000)
        setTimeout(function () { message.style.display = 'none'; }, 5000)
    } else {
        setTimeout(function () { message.style.display = 'block'; miseAjour1.textContent = 'Ajout du budget'; miseAjour2.textContent = 'Votre budjet a été ajouté avec succès';}, 1000)
        setTimeout(function () { message.style.display = 'none'; }, 5000)
        // itemList.Budget = (parseFloat(itemList.Budget) || 0) + parseFloat(budgetInput.value);

      calculate(false);
    }
  }

  function addExpense() {
    if (expenseFirstInput.value === "" || expenseSecondInput.value < 0) {
        setTimeout(function () { 
            miseAjour1.textContent = 'Ajout de la depense'; 
            miseAjour2.textContent = 'le montant de votre depense doit être positif'; 
            message.style.display = 'block'; 
        }, 1000);
        setTimeout(function () { 
            message.style.display = 'none'; 
        }, 5000);
    } else {
        const title = expenseFirstInput.value;
        const value = parseFloat(expenseSecondInput.value);

        setTimeout(function () { 
            miseAjour1.textContent = 'Ajout de la depense'; 
            miseAjour2.textContent = 'Votre depense a été ajouté avec succès'; 
            message.style.display = 'block'; 
        }, 1000);
        setTimeout(function () { 
            message.style.display = 'none'; 
        }, 4000);

        const existingExpenseIndex = itemList.expenses.findIndex(expense => expense.title === title);

        if (existingExpenseIndex !== -1) {
            // Si le titre existe, incrémentez la valeur
            itemList.expenses[existingExpenseIndex].value += value;
        } else {
            // Sinon, ajoutez une nouvelle dépense
            itemList.expenses.push({ title, value });
        }

        calculate(true);
    }
}



  function calculate(val) {
    if (!val) {
        itemList.Budget = (parseFloat(itemList.Budget) || 0) + parseFloat(budgetInput.value);
    }
    itemList.Expense = calculateExpenses();
    itemList.Balance = itemList.Budget - itemList.Expense;
    localStorage.setItem("itemList", JSON.stringify(itemList));
    setValues();
  }

  function setValues() {
    BudgetPrice.textContent = `${itemList.Budget} F`;
    ExpensePrice.textContent = `${itemList.Expense} F`;
    BalancePrice.textContent = `${itemList.Balance} F`;
    budgetInput.value = "";
    expenseSecondInput.value = "";
    expenseFirstInput.value = "";
    if (itemList.Balance >= 0) {
        document.querySelector('.Return-price-nouns-forBalance').style.color = 'green';
    } else {
        document.querySelector('.Return-price-nouns-forBalance').style.color = 'red';
    }
    showListExpenses();
  }

  function calculateExpenses() {
    let total = 0;
    if (itemList.expenses) {
      for (let item of itemList.expenses) {
        total += parseFloat(item.value);
      }
    }
    return total;
  }

  function showListExpenses() {
    root.innerHTML = "";
    let content = "";
    for (let [key, item] of Object.entries(itemList.expenses)) {
      let expenseHTML = `
      <div class="Return-detail-nouns">
          <p class="Return-detail-nouns-own" data-title="${item.title}">${item.title}</p>
          <p class="Return-detail-nouns-price" style="margin-left: 150px;">${item.value} F</p>
          <i id="${key}" style="margin-left: 120px; color: aqua;" class="fa-regular fa-pen-to-square edit-button"></i>
          <i id="${key}" style="color: red;" class="fa-solid fa-trash delete-button"></i>
      </div>
      <div style="border: 0.5px aqua solid " class='w-100 border bg-primary mb-5'></div>
  `;

      content += expenseHTML;
    }
    root.innerHTML += content;
  
    setEvents();
    updateChartLabels();
  }

  function setEvents() {
    const editButtons = document.querySelectorAll(".edit-button");
    const deleteButtons = document.querySelectorAll(".delete-button");
  
    editButtons.forEach(item => {
      item.addEventListener("click", editExpense, false);
    });
    deleteButtons.forEach(item => {
      item.addEventListener("click", deleteExpense, false);
    });
  }
  

  function editExpense(e) {
    let id = e.target.id;
    let title = itemList.expenses[id].title;
    let value = itemList.expenses[id].value;
    itemList.expenses.splice(id, 1);
    calculate(true);
    expenseFirstInput.value = title;
    expenseSecondInput.value = value;
  }
  
  function deleteExpense(e) {
    let id = e.target.id;
    itemList.expenses.splice(id, 1);
    calculate(true);
  }

  function Reset () {
    localStorage.clear();
    BudgetPrice.textContent = 0 + ' F';
    BalancePrice.textContent = 0 + ' F';
    ExpensePrice.textContent = 0 + ' F';
    expenseFirstInput.value = '';
    expenseSecondInput.value = '';
    separatorDiv.remove();
    itemList = [];
    localStorage.removeItem("BudgetPrice");
    localStorage.removeItem("BalancePrice");
    localStorage.removeItem("ExpensePrice");
    updateChartLabels();

}




window.onload = function () {
    const hdt = document.getElementById('myChart1');
    const colors = ['aqua', 'purple', 'orange', 'green', 'blue', 'red', 'yellow'];
        const expenseLabels = itemList.expenses.map(expense => expense.title);
        const expenseData = itemList.expenses.map(expense => expense.value);
        const backgroundColors = colors.slice(0, expenseLabels.length);
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(hdt, {
        type: 'doughnut',
        data: {
            labels: expenseLabels,
            datasets: [{
                data: expenseData,
                backgroundColor:backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            circumference: 360,
            rotation: 360,
            cutout: 140
        }
    });
    myChart.update();
};
function updateChartLabels() {
    if (itemList.expenses && myChart && myChart.data) {
        const colors = ['aqua', 'purple', 'orange', 'green', 'blue', 'red', 'yellow'];
        const expenseLabels = itemList.expenses.map(expense => expense.title);
        const expenseData = itemList.expenses.map(expense => expense.value);
        const backgroundColors = colors.slice(0, expenseLabels.length);
        myChart.data.labels = expenseLabels;
        myChart.data.datasets[0].data = expenseData;
        myChart.data.datasets[0].backgroundColor = backgroundColors;
        myChart.update();
    }
}

histore.addEventListener('click', function () {
    Historique.style.display = 'block'
})
ferme.addEventListener('click', function () {
    Historique.style.display = 'none'
})

function recentActivity() {
    let historique = document.createElement('div');
  historique.style.display = 'flex';
  historique.style.justifyContent = 'space-between';
  
    for (let [key, item] of itemList.expenses.entries()) {
      historique.innerHTML = `
        <p>0${itemID + 1}</p>
        <p class="ReturnDetailNounsOwn">${item.title}</p>
        <p class="Return-detail-nouns-price" style="margin-left: 150px;">${item.value} F</p> <br>`;
    }
  
    let trait = document.createElement('div');
  trait.classList.add('.w-100');
  trait.style.border = '0.5px aqua solid';
  
  parent.parentNode.insertBefore(historique, parent);
  parent.parentNode.insertBefore(trait, parent);
  
  itemID++
  }
