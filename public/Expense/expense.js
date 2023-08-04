const amountArea = document.getElementById("amount");
const descriptionArea = document.getElementById("description");
const categoryArea = document.getElementById("category");
const list = document.getElementById("list");
const razBtn = document.getElementById("raz-btn");
const message = document.getElementById("message");
const Expense = document.getElementById("Expense");
const Earning = document.getElementById("Earning");
const earninginput = document.getElementById("earninginput");
const Balance = document.getElementById("balance");

function addEarning() {
  const EarningAmount =
    Number(Earning.textContent) + Number(earninginput.value);

  localStorage.setItem("earningamount", EarningAmount);
  Earning.textContent = localStorage.getItem("earningamount");

  Balance.textContent = Earning.textContent - Expense.textContent;
  earninginput.value = "";
}

function resetEarning() {
  Balance.textContent = Balance.textContent - Earning.textContent;

  localStorage.setItem("earningamount", 0);
  Earning.textContent = localStorage.getItem("earningamount");
}

async function addItem(event) {
  event.preventDefault();

  const amount = event.target.amount.value;
  const description = event.target.description.value;
  const category = event.target.category.value;

  ExpenseAmount = Number(Expense.textContent) + Number(amount);
  localStorage.setItem("expenseamount", ExpenseAmount);
  Expense.textContent = localStorage.getItem("expenseamount");

  const obj = {
    amount,
    description,
    category,
  };

  if (amount && description && category) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/expenses/createExpense",
        obj,
        {
          headers: { Authorization: token },
        }
      );

      console.log(response);

      ShowOnScreen(response.data);
      event.target.reset();
    } catch (err) {
      console.log(err);
    }
  }
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

async function showPremiumUserMessage() {
  razBtn.onclick = null;
  razBtn.innerText = "You are a Premium User";
  razBtn.style = "cursor : default";
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");
    const decodeToken = parseJwt(token);
    const ispremiumuser = decodeToken.ispremiumuser;

    if (ispremiumuser) {
      showPremiumUserMessage();
      showLeaderBoard();
      showDownloadBtn();
    }

    let currentPage = 1;

    async function getExpenses(page) {
      const limit = document.getElementById("limit").value;

      const { data } = await axios.get(
        `http://localhost:4000/getExpenses?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: token },
        }
      );
      console.log(data);
      list.innerHTML = "";

      data.expenses.forEach((element) => {
        ShowOnScreen(element);
      });

      document.getElementById("limit").addEventListener("change", () => {
        getExpenses(page);
      });
      document.getElementById("currentPageBtn").textContent = data.currentPage;
      document.getElementById("prevPageBtn").disabled = data.currentPage === 1;
      document.getElementById("nextPageBtn").disabled =
        data.currentPage === data.totalPages;
    }

    getExpenses(currentPage);

    document.getElementById("prevPageBtn").addEventListener("click", () => {
      currentPage--;
      getExpenses(currentPage);
    });
    document.getElementById("nextPageBtn").addEventListener("click", () => {
      currentPage++;
      getExpenses(currentPage);
    });
  } catch (err) {
    console.log(err);
  }
});

async function ShowOnScreen(res) {
  const token = localStorage.getItem("token");

  Earning.textContent = localStorage.getItem("earningamount");
  Expense.textContent = localStorage.getItem("expenseamount");
  Balance.textContent = Earning.textContent - Expense.textContent;

  const li = document.createElement("li");

  li.className =
    "list-group-item align-self-center w-50 mb-2 text-white p-3 d-block";
  li.style = "background-color: rgba(44, 42, 47, 0.818);font-size:large";
  li.id = "list-item";

  li.append(
    document.createTextNode(res.amount),
    " - ",
    document.createTextNode(res.description),
    " - ",
    document.createTextNode(res.category)
  );

  const delbtn = document.createElement("button");

  delbtn.className = "btn btn-sm float-right delete";
  delbtn.textContent = "Delete";

  delbtn.onclick = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`http://localhost:4000/deleteExpense/${res._id}`, {
        headers: { Authorization: token },
      });
      list.removeChild(li);
      ExpenseAmount = Number(Expense.textContent) - Number(res.amount);
      localStorage.setItem("expenseamount", ExpenseAmount);
      Expense.textContent = localStorage.getItem("expenseamount");
      Balance.textContent = +Balance.textContent + +res.amount;
    } catch (err) {
      console.log(err);
    }
  };
  li.append(delbtn);

  const editbtn = document.createElement("button");
  editbtn.className = "btn btn-sm float-right edit mr-2";
  editbtn.textContent = " Edit ";
  editbtn.id = "edit";

  editbtn.onclick = async () => {
    try {
      await axios.delete(`http://localhost:4000/deleteExpense/${res._id}`, {
        headers: { Authorization: token },
      });
      list.removeChild(li);
    } catch (err) {
      console.error(err);
    }
    amountArea.value = res.amount;
    descriptionArea.value = res.description;
    categoryArea.value = res.category;

    ExpenseAmount = Number(Expense.textContent) - Number(res.amount);
    localStorage.setItem("expenseamount", ExpenseAmount);
    Expense.textContent = localStorage.getItem("expenseamount");
    Balance.textContent = +Balance.textContent + +res.amount;
  };

  li.append(editbtn);
  list.append(li);

  form.reset();
}

async function showLeaderBoard() {
  const leaderBoardBtn = document.getElementById("showleaderBtn");
  leaderBoardBtn.style.visibility = "visible";
  leaderBoardBtn.onclick = async () => {
    try {
      const token = localStorage.getItem("token");
      const leaderBoardData = await axios.get(
        "http://localhost:4000/premium/showleaderBoard",
        { headers: { Authorization: token } }
      );

      const leaderBoardItem = document.getElementById("leaderboard");
      leaderBoardItem.classList = "container card card-body w-50 d-block";
      leaderBoardItem.innerHTML += "<h3>Leader Board</h3>";
      leaderBoardData.data.forEach((userDetails) => {
        leaderBoardItem.innerHTML += `<li class="bg-secondary mb-1 w-100 p-2" style = "list-style : none"> Name - ${
          userDetails.username
        } , Total Expense - ${userDetails.total_Expense || 0}`;
      });
    } catch (err) {
      console.log(err);
    }
  };
}

// const downloadBtn = document.getElementById("downloadexpense");
function showDownloadBtn() {
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "Download Expense";
  downloadBtn.className = "btn border border-dark bg-dark text-white w-25";
  downloadBtn.style = "margin-left: 74%;";
  // downloadBtn.addEventListener("click", handleDownloadBtn);

  const downloadBtndiv = document.getElementById("downloadExpense");
  downloadBtndiv.appendChild(downloadBtn);

  downloadBtn.onclick = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/user/download", {
        headers: { Authorization: token },
      });
      if (response.status === 200) {
        //the bcakend is essentially sending a download link
        //  which if we open in browser, the file would download
        var a = document.createElement("a");
        a.href = response.data.fileURl;
        a.download = "myexpense.csv";
        a.click();
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
}

razBtn.onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:4000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  console.log("response : ", response);
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.orderid,
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:4000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );
      // alert("You are a Premium User Now");
      showPremiumUserMessage();
      showLeaderBoard();
      localStorage.setItem("token", res.data.token);
      // console.log(localStorage.getItem("token"));

      // razBtn.remove();
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    console.log(response);
    alert("Something Went wrong");
  });
};

// const addBtn = document.getElementById("addbtn");
// const dailyBtn = document.getElementById("dailybtn");
// const addBtnPage = document.getElementById("addbtnpage");
// const dailyBtnPage = document.getElementById("dailybtnpage");

// addBtn.onclick = async () => {
//   addBtnPage.classList = "active";
//   dailyBtnPage.classList = "d-none";
// };

// dailyBtn.onclick = async () => {
//   dailyBtnPage.classList = "m-auto w-75 d-block p-3 bg-secondary";
//   addBtnPage.classList = "d-none";
// };
