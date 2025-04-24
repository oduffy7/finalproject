document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("expenseForm");
  
    if (form) {
      const expenseList = document.getElementById("expenseList");
  

      form.addEventListener("submit", function (e) {
        e.preventDefault();
  
        const date = document.getElementById("date").value;
        const amount = document.getElementById("amount").value;
        const description = document.getElementById("description").value;
        const payment = document.getElementById("payment").value;
  
        const newExpense = { date, amount, description, payment };
  
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses.push(newExpense);
        localStorage.setItem("expenses", JSON.stringify(expenses));
  
        alert("Expense added!");
        form.reset();
        renderExpenses();
      });
  
      function renderExpenses() {
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  
        if (expenses.length === 0) {
          expenseList.innerHTML = "<p>No expenses yet.</p>";
          return;
        }
  
        let html = `<table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Payment</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>`;
  
        expenses.forEach((expense, index) => {
          html += `
            <tr>
              <td>${expense.date}</td>
              <td>$${expense.amount}</td>
              <td>${expense.description}</td>
              <td>${expense.payment}</td>
              <td><button onclick="removeExpense(${index})">❌</button></td>
            </tr>`;
        });
  
        html += `</tbody></table>`;
        expenseList.innerHTML = html;
      }
  
      window.removeExpense = function (index) {
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses.splice(index, 1);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        renderExpenses();
      };

      renderExpenses();
    }

    const chartCanvas = document.getElementById("expenseChart");
  
    if (chartCanvas) {
      const raw = localStorage.getItem("expenses");
      const expenses = raw ? JSON.parse(raw) : [];
  
      const categoryTotals = {};
  
      expenses.forEach((item) => {
        const category = item.description || "Uncategorized";
        categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(item.amount);
      });
  
      new Chart(chartCanvas, {
        type: "pie",
        data: {
          labels: Object.keys(categoryTotals),
          datasets: [
            {
              label: "Expenses by Category",
              data: Object.values(categoryTotals),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "right",
            },
          },
        },
      });
    }
  });
  