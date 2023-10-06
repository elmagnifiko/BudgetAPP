
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
let parent = document.querySelector('.parent');

let compte = document.querySelector('.Return-detail-nouns');
let bar = document.querySelector('.bg-primary');
let miseAjour1 = document.querySelector('.miseAjour1');
let miseAjour2 = document.querySelector('.miseAjour2');
let ferme = document.querySelector('.close')
let separatorDiv = document.createElement('div');
let itemList = [];
let itemID = 0;


console.log(histore);
window.onload = function () {
    const storedItemList = JSON.parse(localStorage.getItem('itemList'));

    if (storedItemList) {
        itemList = storedItemList;

        updateChartLabels();
        charder ()
        addExpense(itemList)
    }
    stockLocal()
};


function stockLocal() {

    if (localStorage.getItem('BudgetPrice') != null || localStorage.getItem('BalancePrice') != null || localStorage.getItem('ExpensePrice') != null) {
        BudgetPrice.textContent = localStorage.getItem('BudgetPrice');
        BalancePrice.textContent = localStorage.getItem('BalancePrice');
        ExpensePrice.textContent = localStorage.getItem('ExpensePrice');
    }
}



function salaire() {
    let monSalaire = parseInt(budgetInput.value);
    if (!monSalaire || monSalaire < 0) {
        let message = document.querySelector('.message');
        setTimeout(function () { message.style.display = 'block';history.style.position = 'relative'; miseAjour1.textContent = 'Ajout du budget'; miseAjour2.innerHTML = 'Votre budjet doit être un nombre positif <br> et ne dois pas être un champ vide';  }, 1000)
        setTimeout(function () { message.style.display = 'none'; }, 5000)
    } else {
        let ancienBudget = parseInt(BudgetPrice.textContent);
        let nouveauBudget = ancienBudget + monSalaire;

        BudgetPrice.textContent = nouveauBudget + ' F';
        showBalance()
        budgetInput.value = '';

        let message = document.querySelector('.message');
        setTimeout(function () { history.style.position = 'relative'; miseAjour1.textContent = 'Ajout du budget'; miseAjour2.textContent = 'Votre budjet a été ajouté avec succès'; message.style.display = 'block'; }, 1000)
        setTimeout(function () { message.style.display = 'none'; }, 5000)
    }
    clearTimeout()
    localStorage.setItem('BudgetPrice', BudgetPrice.textContent);
}


reset.addEventListener('click', function () {
    BudgetPrice.textContent = 0 + ' F';
    BalancePrice.textContent = 0 + ' F';
    ExpensePrice.textContent = 0 + ' F';
    expenseFirstInput.value = '';
    expenseSecondInput.value = '';
    compte.remove();
    separatorDiv.remove();
    itemList = [];
    localStorage.clear();
    localStorage.removeItem("BudgetPrice");
    localStorage.removeItem("BalancePrice");
    localStorage.removeItem("ExpensePrice");
    updateChartLabels();
    let Historique = document.querySelector('.Historique');
    Historique.style.display = 'block';

})



function totalExpense() {
    let total = 0;
    if (itemList.length > 0) {
        total = itemList.reduce(function (acc, curr) {
            acc += curr.amount;

            return acc;
        }, 0)
    }
    ExpensePrice.textContent = total + ' F';

    return total;

}



function showBalance() {
    const tousDepense = totalExpense();
    const total = parseInt(BudgetPrice.textContent) - tousDepense;
    BalancePrice.textContent = total + ' F';

    if (total <= 0) {
        document.querySelector('.Return-price-nouns-forBalance').style.color = 'red';
    } else {
        document.querySelector('.Return-price-nouns-forBalance').style.color = 'green';
    }
    localStorage.setItem('BalancePrice', BalancePrice.textContent);
    localStorage.setItem('ExpensePrice', ExpensePrice.textContent);
}





function EditExpense(element) {
    let id = parseInt(element.id);
    let expenseDiv = document.getElementById(element.id)

    let separatorDiv = expenseDiv.nextElementSibling

    expenseDiv.remove()
    separatorDiv.remove();
    let expense = itemList.filter(function (item) {
        return item.id === id;

    })
    expenseFirstInput.value = expense[0].title;
    expenseSecondInput.value = expense[0].amount;

    let templist = itemList.filter(function (item) {
        return item.id !== id;
    })
    itemList = templist;
    showBalance()
}



function deleteExpense(element) {
    let id = parseInt(element.id);
    let expenseDiv = document.getElementById(element.id)

    let separatorDiv = expenseDiv.nextElementSibling;



    expenseDiv.remove();
    separatorDiv.remove();

    let templist = itemList.filter(function (item) {
        return item.id !== id;
    })
    itemList = templist;
    showBalance()
    updateChartLabels();
    localStorage.setItem('itemList', JSON.stringify(itemList));
}

function charder() {
    const storedItemList = JSON.parse(localStorage.getItem('itemList'));

    if (storedItemList !== null) {
        for (let i = 0; i < storedItemList.length; i++) {
            let expenseDiv = document.createElement('div');
            expenseDiv.classList.add('Return-detail-nouns');
            expenseDiv.innerHTML = `<p class="Return-detail-nouns-own">${storedItemList[i].title}</p>
          <p class="Return-detail-nouns-price" style="margin-left: 150px;">${storedItemList[i].amount} F</p>
          <i style="margin-left: 120px; color: aqua;" id='${storedItemList[i].id}' class="fa-regular fa-pen-to-square"></i>
          <i style="color: red;" id="${storedItemList[i].id}" class="fa-solid fa-trash"></i>`;
            expenseDiv.id = storedItemList[i].id;
            let separatorDiv = document.createElement('div');
            separatorDiv.style.border = '0.5px aqua solid';
            separatorDiv.className = 'w-100 mb-3';
            separatorDiv.id = storedItemList[i].id;
            bar.parentNode.insertBefore(expenseDiv, bar);
            bar.parentNode.insertBefore(separatorDiv, bar);

            let historique = document.createElement('div')
            historique.style.display = 'flex';
            historique.style.justifyContent = 'space-between'
            historique.innerHTML = `<p>01</p>
            <p class="ReturnDetailNounsOwn">${storedItemList[i].title}</p>
            <p class="Return-detail-nouns-price" style="margin-left: 150px;">${storedItemList[i].amount}f</p> <br>`;
            let trait = document.createElement('div')
            trait.classList.add('.w-100');
            trait.style.border = '0.5px aqua solid'

            parent.parentNode.insertBefore(historique, parent)
            parent.parentNode.insertBefore(trait, parent)
            Depense();
        }
    } else {
        console.log('La clé spécifiée n\'existe pas dans le localStorage.');
    }
}


function addExpense(expense) {

    let expenseDiv = document.createElement('div');
    expenseDiv.classList.add('Return-detail-nouns');
    expenseDiv.innerHTML = `<p class="Return-detail-nouns-own">${expense.title}</p>
  <p class="Return-detail-nouns-price" style="margin-left: 150px;">${expense.amount} F</p>
  <i style="margin-left: 120px; color: aqua;" id='${expense.id}' class="fa-regular fa-pen-to-square"></i>
  <i style="color: red;" id="${expense.id}" class="fa-solid fa-trash"></i>`;
    expenseDiv.id = expense.id
    let separatorDiv = document.createElement('div');
    separatorDiv.style.border = '0.5px aqua solid';
    separatorDiv.className = 'w-100 mb-3'
    separatorDiv.id = expense.id
    bar.parentNode.insertBefore(expenseDiv, bar)
    bar.parentNode.insertBefore(separatorDiv, bar);

    let historique = document.createElement('div')
    historique.style.display = 'flex';
    historique.style.justifyContent = 'space-between'
    historique.innerHTML = `<p>0${expense.id + 1}</p>
    <p class="ReturnDetailNounsOwn">${expense.title}</p>
    <p class="Return-detail-nouns-price" style="margin-left: 150px;">${expense.amount}f</p> <br>`;
    let trait = document.createElement('div')
    trait.classList.add('.w-100');
    trait.style.border = '0.5px aqua solid'

    parent.parentNode.insertBefore(historique, parent)
    parent.parentNode.insertBefore(trait, parent)
    const editIcon = expenseDiv.querySelector('.fa-regular.fa-pen-to-square');
    const deleteIcon = expenseDiv.querySelector('.fa-solid.fa-trash');


    editIcon.addEventListener('click', function () {
        EditExpense(editIcon)
        let message = document.querySelector('.message');
        setTimeout(function () { miseAjour1.textContent = 'Mis à jour'; miseAjour2.textContent = 'Votre depense a été mis à jour avec success'; message.style.display = 'block'; }, 1000)
        setTimeout(function () { message.style.display = 'none'; }, 5000)
    })
    deleteIcon.addEventListener('click', function () {
        deleteExpense(deleteIcon)
        let message = document.querySelector('.message');
        setTimeout(function () { miseAjour1.textContent = 'Suppression de la depense'; miseAjour2.textContent = `la depense du ${expense.title} a été supprimé avec success`; message.style.display = 'block'; }, 1000)
        setTimeout(function () { message.style.display = 'none'; }, 5000)
    })
}


function Depense() {
    let produit = expenseFirstInput.value;
    let compte = expenseSecondInput.value;
    if (compte < 0 || produit === '') {
        let message = document.querySelector('.message');
        setTimeout(function () { miseAjour1.textContent = 'Ajout de la depense'; miseAjour2.textContent = 'le montant de votre depense doit être positive'; message.style.display = 'block'; }, 1000)
        setTimeout(function () { message.style.display = 'none'; }, 5000)
    } else {

        let prix = parseInt(compte)
        expenseFirstInput.value = '';
        expenseSecondInput.value = '';

        let expense = {
            id: itemID,
            title: produit,
            amount: prix,
        }

        itemID++;
        itemList.push(expense)
        addExpense(expense)
        let message = document.querySelector('.message');
        setTimeout(function () { miseAjour1.textContent = 'Ajout de la depense'; miseAjour2.textContent = 'Votre depense a été ajouté avec success'; message.style.display = 'block'; }, 1000)
        setTimeout(function () { message.style.display = 'none'; }, 4000)
        showBalance()
        localStorage.setItem('itemList', JSON.stringify(itemList));
        updateChartLabels();
    }

};


expenseButton.addEventListener('click', function (event) {
    event.preventDefault();
    Depense();
    console.log('hdfdfdsmfu');
});


budgetButton.addEventListener('click', function (event) {
    event.preventDefault();
    salaire();
    console.log('hdfdfdsmfu');
});

document.addEventListener('DOMContentLoaded', function () {
    const storedItemList = JSON.parse(localStorage.getItem('itemList'));
    if (storedItemList) {
        itemList = storedItemList;

    }
    stockLocal();
    for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].title !== '' || itemList[i].amount !== null) {
            charder();

        }

    }
    let expenseDiv = document.querySelector('.Return-detail-nouns')

    const editIcon = document.querySelector('.fa-regular.fa-pen-to-square');
    const deleteIcon = document.querySelector('.fa-solid.fa-trash');


    editIcon.addEventListener('click', function () {
        EditExpense(editIcon)
        let message = document.querySelector('.message');
        setTimeout(function () { miseAjour1.textContent = 'Mis à jour'; miseAjour2.textContent = 'Votre depense a été mis à jour avec success'; message.style.display = 'block'; }, 1000)
        setTimeout(function () { message.style.display = 'none'; }, 5000)
    })
    deleteIcon.addEventListener('click', function () {
        deleteExpense(deleteIcon)
        let message = document.querySelector('.message');
        setTimeout(function () { miseAjour1.textContent = 'Suppression de la depense'; miseAjour2.textContent = `la depense du ${expense.title} a été supprimé avec success`; message.style.display = 'block'; }, 1000)
        setTimeout(function () { message.style.display = 'none'; }, 5000)
    })

});

// pour le graphique

const colors = ['aqua', 'purple', 'orange', 'green', 'blue', 'red', 'yellow'];


window.onload = function () {
    const hdt = document.getElementById('myChart1');
    const expenseLabels = itemList.map(expense => expense.title);
    const expenseData = itemList.map(expense => expense.amount);
    const backgroundColors = colors.slice(0, expenseLabels.length);
    myChart = new Chart(hdt, {
        type: 'doughnut',
        data: {
            labels: expenseLabels,
            datasets: [{
                data: expenseData,
                backgroundColor: backgroundColors,
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
    const expenseLabels = itemList.map(expense => expense.title);
    const expenseData = itemList.map(expense => expense.amount);
    const backgroundColors = colors.slice(0, expenseLabels.length);

    myChart.data.labels[0] = expenseLabels;
    myChart.data.datasets[0].data = expenseData;
    myChart.data.datasets[0].backgroundColor = backgroundColors;

    myChart.update();
}

histore.addEventListener('click', function () {

    Historique.style.display = 'block'
})
ferme.addEventListener('click', function () {

    Historique.style.display = 'none'
})