document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("username")) {
        showMainPage(localStorage.getItem("username"));
    } else {
        showLoginPage();
    }
});

function showLoginPage() {
    document.getElementById("loginPage").classList.remove("d-none");
    document.getElementById("mainPage").classList.add("d-none");

    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();
        let username = document.getElementById("username").value;
        localStorage.setItem("username", username);
        showMainPage(username);
    });
}

function showMainPage(username) {
    document.getElementById("loginPage").classList.add("d-none");
    document.getElementById("mainPage").classList.remove("d-none");
    document.getElementById("incomePage").classList.add("d-none");
    document.getElementById("outcomePage").classList.add("d-none");
    document.getElementById("userName").textContent = username;

    document.getElementById("logoutLink").addEventListener("click", function () {
        localStorage.removeItem("username");
        showLoginPage();
    });

    document.getElementById("mainLink").addEventListener("click", function (event) {
        event.preventDefault();
        showMainPage(username);
    });

    document.getElementById("incomeLink").addEventListener("click", function (event) {
        event.preventDefault();
        showIncomePage(username);
    });

    document.getElementById("outcomeLink").addEventListener("click", function (event) {
        event.preventDefault();
        showOutcomePage(username);
    });

    document.getElementById("aboutLink").addEventListener("click", function (event) {
        event.preventDefault();
        window.location.assign("about.html");
        showModal("About Me", "About Me Page");
        
    });

    let balance = localStorage.getItem("balance") ? parseInt(localStorage.getItem("balance")) : 0;
    let transactions = localStorage.getItem("transactions") ? JSON.parse(localStorage.getItem("transactions")) : [];

    updateBalance(balance);
    updateTransactions(transactions);
}

function updateBalance(balance) {
    document.getElementById("balance").textContent = "Rp " + balance.toLocaleString();
}

function updateTransactions(transactions) {
    let transactionList = document.getElementById("transactionList");
    transactionList.innerHTML = "";
    if (transactions.length === 0) {
        transactionList.innerHTML = "<li class='list-group-item'>Belum ada transaksi sejauh ini</li>";
    } else {
        transactions.forEach(function (transaction, index) {
            let listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.textContent = transaction.name + " - " + "Rp " + transaction.amount.toLocaleString() + " - " + transaction.category;
            if (transaction.type === "income") {
                listItem.style.color = "green";
            } else {
                listItem.style.color = "red";
            }
            let deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-sm", "btn-danger", "ml-2");
            deleteButton.textContent = "Hapus";
            deleteButton.addEventListener("click", function () {
                deleteTransaction(index);
            });
            listItem.appendChild(deleteButton);
            transactionList.appendChild(listItem);
        });
    }
}

function deleteTransaction(index) {
    let transactions = localStorage.getItem("transactions") ? JSON.parse(localStorage.getItem("transactions")) : [];
    if (index >= 0 && index < transactions.length) {
        let deletedTransaction = transactions.splice(index, 1)[0];
        if (deletedTransaction.type === "income") {
            let balance = localStorage.getItem("balance") ? parseInt(localStorage.getItem("balance")) : 0;
            balance -= deletedTransaction.amount;
            localStorage.setItem("balance", balance);
            updateBalance(balance);
        } else {
            let balance = localStorage.getItem("balance") ? parseInt(localStorage.getItem("balance")) : 0;
            balance += deletedTransaction.amount;
            localStorage.setItem("balance", balance);
            updateBalance(balance);
        }
        localStorage.setItem("transactions", JSON.stringify(transactions));
        updateTransactions(transactions);
        showModal("Delete","Data Berhasil Di hapus.")
    } else {
        alert("Indeks transaksi tidak valid.");
    }
}

document.getElementById("clearTransactions").addEventListener("click", function () {
    $('#confirmClearModal').modal('show'); // Tampilkan modal konfirmasi
});

$('#confirmClearButton').click(function () {
    localStorage.removeItem("transactions");
    updateTransactions([]);
    localStorage.setItem("balance", 0);
    updateBalance(0);
    $('#confirmClearModal').modal('hide'); 
});


function showIncomePage(username) {
    document.getElementById("mainPage").classList.add("d-none");
    document.getElementById("incomePage").classList.remove("d-none");
    document.getElementById("incomeForm").reset(); // Reset income form

    document.getElementById("incomeForm").addEventListener("submit", function (event) {
        event.preventDefault();
        let name = document.getElementById("incomeName").value;
        let amount = parseInt(document.getElementById("incomeAmount").value);
        let category = document.getElementById("incomeCategory").value;

        if (name && amount && category) {
            let transactions = localStorage.getItem("transactions") ? JSON.parse(localStorage.getItem("transactions")) : [];

            // Periksa apakah transaksi sudah ada dalam riwayat
            let isDuplicate = transactions.some(transaction => 
                transaction.name === name && 
                transaction.amount === amount && 
                transaction.category === category &&
                transaction.type === "income"
            );

            if (!isDuplicate) {
                let transaction = {
                    name: name,
                    amount: amount,
                    category: category,
                    type: "income"
                };

                transactions.push(transaction);
                localStorage.setItem("transactions", JSON.stringify(transactions));

                let balance = localStorage.getItem("balance") ? parseInt(localStorage.getItem("balance")) : 0;
                balance += amount;
                localStorage.setItem("balance", balance);

                updateBalance(balance);
                updateTransactions(transactions);

                showModal("Income", "Transaksi Sukses!!");
                showMainPage(username);
            } else {
                showModal("Income", "Transaksi sudah ada dalam riwayat.");
            }
        } else {
            alert("Transaksi belum selesai, silakan lengkapi formulir!");
        }
    });
}

function showOutcomePage(username) {
    document.getElementById("mainPage").classList.add("d-none");
    document.getElementById("outcomePage").classList.remove("d-none");
    document.getElementById("outcomeForm").reset();

    document.getElementById("outcomeForm").addEventListener("submit", function (event) {
        event.preventDefault();
        let name = document.getElementById("outcomeName").value;
        let amount = parseInt(document.getElementById("outcomeAmount").value);
        let category = document.getElementById("outcomeCategory").value;

        if (name && amount && category) {
            let transactions = localStorage.getItem("transactions") ? JSON.parse(localStorage.getItem("transactions")) : [];

            // Periksa apakah transaksi sudah ada dalam riwayat
            let isDuplicate = transactions.some(transaction => 
                transaction.name === name && 
                transaction.amount === amount && 
                transaction.category === category &&
                transaction.type === "outcome"
            );

            if (!isDuplicate) {
                let transaction = {
                    name: name,
                    amount: amount,
                    category: category,
                    type: "outcome"
                };

                transactions.push(transaction);
                localStorage.setItem("transactions", JSON.stringify(transactions));

                let balance = localStorage.getItem("balance") ? parseInt(localStorage.getItem("balance")) : 0;
                balance -= amount; // Kurangi saldo
                localStorage.setItem("balance", balance);

                updateBalance(balance);
                updateTransactions(transactions);

                showModal("Outcome", "Transaksi Sukses!!");
                showMainPage(username);
            } else {
                showModal("Outcome", "Transaksi sudah ada dalam riwayat.");
            }
        } else {
            alert("Transaksi belum selesai, silakan lengkapi formulir!");
        }
    });
}

document.getElementById("backToMain").addEventListener("click", function () {
    showMainPage(localStorage.getItem("username"));
});
document.getElementById("backToMainOutcome").addEventListener("click", function () {
    showMainPage(localStorage.getItem("username"));
});

function showModal(title, message) {
    $('#alertModal .modal-title').text(title);
    $('#alertModal .modal-body').text(message);
    $('#alertModal').modal('show');
}


function showIncomeModal() {
    $('#incomeModal').modal('show');
}

function showOutcomeModal() {
    $('#outcomeModal').modal('show');
}

$('#addIncomeButton').click(function () {
    showIncomeModal();
});

$('#addOutcomeButton').click(function () {
    showOutcomeModal();
});
