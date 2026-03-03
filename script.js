if(!localStorage.getItem("loggedInUser")) {
    window.location.href = "index.html";
}

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let chart;

document.getElementById("expenseForm").addEventListener("submit", function(e){
    e.preventDefault();

    const transaction = {
        title: title.value,
        amount: parseFloat(amount.value),
        type: type.value,
        category: category.value,
        date: date.value
    };

    transactions.push(transaction);
    saveData();
    renderTransactions();
    this.reset();
});

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderTransactions() {

    const list = document.getElementById("transactionList");
    list.innerHTML = "";

    const filterCat = filterCategory.value;
    const filterM = filterMonth.value;

    let filtered = transactions.filter(t => {
        const matchesCategory = filterCat === "all" || t.category === filterCat;
        const matchesMonth = !filterM || t.date.startsWith(filterM);
        return matchesCategory && matchesMonth;
    });

    let income=0, expense=0;

    filtered.forEach((t,i)=>{
        const li = document.createElement("li");
        li.innerHTML = `${t.date} | ${t.title} | ₹${t.amount} | ${t.category}
        <button onclick="deleteTransaction(${i})">❌</button>`;
        list.appendChild(li);

        if(t.type==="income") income+=t.amount;
        else expense+=t.amount;
    });

    totalIncome.innerText = income;
    totalExpense.innerText = expense;
    balance.innerText = income-expense;

    renderChart(filtered);
}

function deleteTransaction(index){
    transactions.splice(index,1);
    saveData();
    renderTransactions();
}

function renderChart(data){
    const ctx = document.getElementById("expenseChart");

    const categories = {};
    data.forEach(t=>{
        if(t.type==="expense"){
            categories[t.category] = (categories[t.category]||0)+t.amount;
        }
    });

    if(chart) chart.destroy();

    chart = new Chart(ctx,{
        type:'doughnut',
        data:{
            labels:Object.keys(categories),
            datasets:[{data:Object.values(categories)}]
        }
    });
}

function exportCSV(){
    let csv = "Title,Amount,Type,Category,Date\n";
    transactions.forEach(t=>{
        csv += `${t.title},${t.amount},${t.type},${t.category},${t.date}\n`;
    });

    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "expenses.csv";
    a.click();
}

function toggleDarkMode(){
    document.body.classList.toggle("dark");
}

function logout(){
    localStorage.removeItem("loggedInUser");
    window.location.href="index.html";
}

renderTransactions();