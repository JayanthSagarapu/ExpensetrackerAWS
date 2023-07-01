const signBtn = document.getElementById("sign");
const loginBtn = document.getElementById("login");
const errormsg = document.getElementById("error");

signBtn.onclick = async () => {
  window.location.href = "/Signup/signup.html";
};

loginBtn.onclick = async () => {
  window.location.href = "/Login/login.html";
};

async function signUp(event) {
  try {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const obj = {
      username,
      email,
      password,
    };

    if (username && email && password) {
      const response = await axios.post(
        "http://13.51.162.236:4000/user/signup",
        obj
      );
      console.log(response);
      window.location.href = "/Login/login.html";
    }
  } catch (err) {
    errormsg.innerText = `Error : ${err.message}, Something went wrong`;
    errormsg.class =
      "bi bi-exclamation-triangle text-danger mt-3 w-50 p-3 ml-3";
    console.log(err);
  }
}
