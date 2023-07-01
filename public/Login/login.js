const signBtn = document.getElementById("sign");
const loginBtn = document.getElementById("login");
const errormsg = document.getElementById("error");

signBtn.onclick = async () => {
  window.location.href = "../Signup/signup.html";
};

loginBtn.onclick = async () => {
  window.location.href = "../Login/login.html";
};

async function login(event) {
  try {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    const obj = {
      email,
      password,
    };

    if (email && password) {
      const response = await axios.post(
        "http://13.51.162.236:4000/user/login",
        obj
      );
      console.log(response);
      localStorage.setItem("token", response.data.token);
      window.location.href = "../Expense/expense.html";
      // event.target.reset();
    }
  } catch (err) {
    errormsg.innerText = `Error : Something went wrong. SignUP if New User`;
    errormsg.class =
      "bi bi-exclamation-triangle text-danger mt-3 w-50 p-3 ml-3";
    console.log(err);
  }
}
