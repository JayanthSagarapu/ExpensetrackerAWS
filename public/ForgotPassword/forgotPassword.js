const signBtn = document.getElementById("sign");
const loginBtn = document.getElementById("login");
const errormsg = document.getElementById("error");

signBtn.onclick = async () => {
  window.location.href = "../Signup/signup.html";
};

loginBtn.onclick = async () => {
  window.location.href = "../Login/login.html";
};

async function forgetPassword(event) {
  try {
    event.preventDefault();
    const email = event.target.email.value;

    if (email) {
      const response = await axios.post(
        "http://localhost:4000/password/forgotpassword",
        {
          email: email,
        }
      );
      window.location.href = "../Login/login.html";
      event.target.reset();
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
}
